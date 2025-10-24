
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


// Create Many Users

type Student ={
  name: string;
  age: number;
  course: string;
  year: number;
  subjects: string[]
}

export async function POST(req:Request) {
  try {
    const {students} : {students: Student[]} = await req.json();
    if(!students) return NextResponse.json({Successful: false, message:"All fields are required"}, {status:400});

    const existUser = await prisma.student.findMany({
      where:{
        OR: students.map((student) => ({
          name: student.name,
          age: student.age,
          course: student.course,
          year: student.year,
          subjects: {hasEvery: student.subjects}
        })),
      }
    });
    if(existUser.length > 0) return NextResponse.json({Successful: false, message:"User already exists"}, {status:400});
    const user = await prisma.student.createMany({
      data: students
    });
    return NextResponse.json({Successful: true, message:"Users created", user}, {status:200});


  } catch (error) {
    console.log("Create user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}


// Create User

// export async function POST(req:Request) {
//   try {
//     const {name, age, course, year, subjects} = await req.json();
//     if(!name || !age || !course || !year || !subjects) {
//       return NextResponse.json({message:"All fields are required"}, {status:400});
//     };
//     const existUser = await prisma.student.findFirst({
//       where: {
//         name,
//         age,
//         course,
//         year,
//         subjects:{
//           equals:subjects
//         }
//       }
//     });
//     if(existUser){
//       return NextResponse.json({message:"User already exists"}, {status:400});
//     };
//     const user = await prisma.student.create({
//       data: {
//         name,
//         age,
//         course,
//         year,
//         subjects
//       }
//     });
//     return NextResponse.json({message:"User created", user}, {status:200});
//   } catch (error) {
//     console.log("Create user error", error);
//     return NextResponse.json({message:"Something went wrong"}, {status:500});
//   }
// }

// Basic Get Query

// export async function GET() {
//   try {
//     const users = await prisma.student.findMany({
//       where: {
//         age:{gte:20},
//         subjects: {hasSome:["AI"]}
//       }
//     });  
//     return NextResponse.json({users}, {status:200});
//   } 
//   catch (error) {
//     console.log("Get users error", error);
//   }
// }

// Get Query with filters

// export async function GET(req:Request) {
//   try {
//     const {searchParams} = new URL(req.url);
//     const course = searchParams.get("course");
//     const sort = searchParams.get("sort");
//     if(!course || !sort) return NextResponse.json({message:"All fields are required"}, {status:400});
//     const users = await prisma.student.findMany({
//       where:{course},
//       orderBy:{
//         age: sort === "desc" ? "desc" : "asc"
//       }
//     });

//     return NextResponse.json({Succesful: true, users}, {status:200});

//   } 
//   catch (error) {
//     console.log("Get users error", error);
//     return NextResponse.json({message:"Something went wrong"}, {status:500});
//   }
// }

// Pagination 
export async function GET(req:Request) {
  try {
    const {searchParams} = new URL(req.url);
    const page =  Number(searchParams.get("page") || "1" );
    const limit =  Number(searchParams.get("limit") || "10");

    // const user = await prisma.student.findMany({
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   orderBy: {
    //     name: "asc"
    //   }
    // });
    const [user, total] = await Promise.all([
      prisma.student.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: "asc"
        }
      }),
      prisma.student.count(),
    ])
    const totalPage = Math.ceil(total / limit);
    return NextResponse.json({Succesful: true, user, total, totalPage}, {status:200});


  } 
  catch (error) {
    console.log("Get users error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}

export async function PATCH(req: Request) {
  try {
    const {name, course} = await req.json();
    if(!name || !course) {
      return NextResponse.json({message:"All fields are required"}, {status:400});
    };

    // Check if user Exist 
    const existUser = await prisma.student.findFirst({
      where: { name}
    });

    if(!existUser){
      return NextResponse.json({message:"User does not exist"}, {status:400});
    };

    const user = await prisma.student.update({
      where:{name},
      data:{course}
    });
    return NextResponse.json({message:"User updated", user}, {status:200});


  } catch (error) {
    console.log("Update user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}

export async function DELETE(req:Request) {
  try {
    const {subjects} = await req.json();
    if(!subjects){
      return NextResponse.json({message:'All fields are required'}, {status:400});
    }
    const user = await prisma.student.deleteMany({
      where:{subjects:{hasSome:subjects}}
    });
    return NextResponse.json({message:"User deleted", user}, {status:200});
  } catch (error) {
    console.log("Delete user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}
