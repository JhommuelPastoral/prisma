import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req:Request) {
  try {
    const {name, age, course, year, subjects} = await req.json();
    if(!name || !age || !course || !year || !subjects) {
      return NextResponse.json({message:"All fields are required"}, {status:400});
    };
    const existUser = await prisma.student.findFirst({
      where: {
        name,
        age,
        course,
        year,
        subjects:{
          equals:subjects
        }
      }
    });
    if(existUser){
      return NextResponse.json({message:"User already exists"}, {status:400});
    };
    const user = await prisma.student.create({
      data: {
        name,
        age,
        course,
        year,
        subjects
      }
    });
    return NextResponse.json({message:"User created", user}, {status:200});
  } catch (error) {
    console.log("Create user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}

export async function GET() {
  try {
    const users = await prisma.student.findMany({
      where: {
        age:{gte:20},
        subjects: {hasSome:["AI"]}
      }
    });  
    return NextResponse.json({users}, {status:200});
  } 
  catch (error) {
    console.log("Get users error", error);
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
