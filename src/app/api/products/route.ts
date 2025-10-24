import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type ProductsInterface = {
  name: string;
  price: number;
  category: string;
  stock: number;
  supplierId: string;
}

export async function POST(req:Request) {
  try {
    const {products} : {products: ProductsInterface[]}  =  await req.json();    
    if(products.length === 0) return NextResponse.json({message:"Products are required"}, {status:400});
    const product = await prisma.products.createMany({
      data: products
    });
    return NextResponse.json({message:"Products created", product, successful: true}, {status:200});

  } catch (error) {
    console.log("Create user error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}

// TASK 2
// export async function GET(req:Request) {
//   try {
//     const {searchParams} = new URL(req.url);
//     const category = searchParams.get("category");
//     if (!category) return NextResponse.json({message:"Category is required"}, {status:400});
//     const product = await prisma.products.findMany({
//       where:{category}
//     });
//     return NextResponse.json({message:"Products fetched", product, successful: true}, {status:200});
//   } catch (error) {
//     console.log("Get Products by category error", error);
//     return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
//   }
// }

// TASK 5
// export async function GET(){
//   try {
//     const product = await prisma.products.findMany({
//       omit:{id: true},
//       orderBy:{
//         price: "desc"
//       }
//     });
//     console.log(product[0]);
//     return NextResponse.json({message:"Products fetched", product, successful: true}, {status:200});
//   } catch (error) {
//     console.log("Get Products", error);
//     return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
//   }
// }


// Task 6 Filter by Price Range

// export async function GET(req:Request) {
//   try {
//     const {searchParams} = new URL(req.url);
//     const fromPriceRange = Number(searchParams.get("fromPriceRange"));
//     const toPriceRange = Number(searchParams.get("toPriceRange"));

//     if(!fromPriceRange || !toPriceRange) return NextResponse.json({message: "Price range is required"}, {status:400});
//     const product = await prisma.products.findMany({
//       where: {
//         price:{
//           gte: fromPriceRange,
//           lte: toPriceRange
//         }
//       }
//     });

//     return NextResponse.json({message:"Products fetched", product, successful: true}, {status:200});
//   } catch (error) {
//     console.log ("Get Products", error);
//     return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
//   }
// }

// Task 7 Counting by Category
// export async function GET(req:Request) {
//   try {
//     const product = await prisma.products.groupBy({
//       by: ["category"],
//       _count: true
//     });
//     if(!product) return NextResponse.json({message:"Products are required"}, {status:400});
//     return NextResponse.json({message:"Products fetched", product, successful: true}, {status:200});

//   } catch (error) {
      // console.log ("Get Products", error);
//     return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
//   }
// }

// Task 8 Average Price per Category
// export async function GET(req:Request) {
//   try {
//     const product = await prisma.products.groupBy({
//       by: ['category'],
//       _avg:{
//         price: true
//       },
//       _count: true,
//       _min:{
//         price: true,
//         name: true
//       },
//       _max: {
//         price: true,
//         name: true
//       }

//     })
//     if(!product) return NextResponse.json({message:"Products are required"}, {status:400});
//     return NextResponse.json({message:"Products fetched", product, successful: true}, {status:200});
//   } catch (error) {
//     console.log ("Get Products", error);
//     return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
//   }  
// }

// Task 2 Update Document
// export async function PATCH(req:Request) {
//   try {
//     const {searchParams} = new URL(req.url);
//     const name = searchParams.get("name");
//     if(!name) return NextResponse.json({message:"Name is required"}, {status:400});

//     const updatedData : Record<string, number> = {};
//     const updatedPrice = Number(searchParams.get("price"));
//     const updatedStock = Number(searchParams.get("stock"));

//     if(updatedPrice) updatedData.price = updatedPrice;
//     if(updatedStock) updatedData.stock = updatedStock;
    
//     if(Object.values(updatedData).length === 0) return NextResponse.json({message:"Price or stock is required"}, {status:400});
//     const product = await prisma.products.updateMany({
//       where:{name},
//       data: updatedData
//     });

//     return NextResponse.json({message:"Product updated", product, successful: true}, {status:200});

//   } catch (error) {
//     console.log("Update product error", error);
//     return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
//   }
// }

// Task 9
// export async function PATCH(req:Request) {
//   try {
//     const products = await prisma.products.findMany({});

//     for(const product of products){
//       const rating : number[] = [];
//       for(let i =0; i <5; i++){
//         const random = Math.floor((Math.random() *5) + 1);
//         rating.push(random);
//       };
//       await prisma.products.update({
//         where: {id: product.id},
//         data: {
//           rating: rating
//         }
//       });
//     };
//     return NextResponse.json({message:"Product updated", successful: true}, {status:200});

//   } catch (error) {
//     console.log("Update product error", error);
//     return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
//   }
// }

// TASK 9 get by rating where gte 4
// export async function GET(req:Request) {
//   try {
//     const products = await prisma.products.findMany({});
//     const gte4RatingProducts = []
//     for(const product of products){
//       const rating = product.rating;
//       const averageRating = rating.reduce((acc, curr) => acc + curr, 0) / rating.length;
//       if(averageRating>=3) gte4RatingProducts.push(product);
//     }
//     return NextResponse.json({message:"Product updated", gte4RatingProducts,successful: true}, {status:200});
//   } catch (error) {
//     console.log("Update product error", error);
//     return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
//   }
// }


// Task 10 Update Multiple Fields

export async function PATCH(req:Request) {
  try {
    const {supplierId} = await req.json();
    if(!supplierId) return NextResponse.json({message:"Supplier Id is required"}, {status:400});
    const product = await prisma.products.updateMany({
      data: {supplierId}
    });
    return NextResponse.json({message:"Product updated", product, successful: true}, {status:200});
  } catch (error) {
    console.log("Update product error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}


export async function GET() {
  try {
    const products = await prisma.products.findMany({include: {supplier: true}});
    if(!products) return NextResponse.json({message:"Products are required"}, {status:400});
    return NextResponse.json({message:"Products fetched", products, successful: true}, {status:200});
  } catch (error) {
    console.log("Get Products error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}


export async function DELETE(req:Request) {
  try {
    const {searchParams} = new URL(req.url);
    const stock = searchParams.get("stock");
    if(!stock) return NextResponse.json({message: 'Stock is required'}, {status:400});
    const product = await prisma.products.deleteMany({
      where: { stock:{lte: Number(stock)}},
    })
    return NextResponse.json({message:"Product deleted", product, successful: true}, {status:200});
  } catch (error) {
    console.log("Delete product error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }

}