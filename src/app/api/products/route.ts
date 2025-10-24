import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type ProductsInterface = {
  name: string;
  price: number;
  category: string;
  stock: number;
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

export async function GET(){
  try {
    const product = await prisma.products.findMany({
      omit:{id: true},
      orderBy:{
        price: "desc"
      }
    });
    console.log(product[0]);
    return NextResponse.json({message:"Products fetched", product, successful: true}, {status:200});
  } catch (error) {
    console.log("Get Products", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }


}

export async function PATCH(req:Request) {
  try {
    const {searchParams} = new URL(req.url);
    const name = searchParams.get("name");
    if(!name) return NextResponse.json({message:"Name is required"}, {status:400});

    const updatedData : Record<string, number> = {};
    const updatedPrice = Number(searchParams.get("price"));
    const updatedStock = Number(searchParams.get("stock"));

    if(updatedPrice) updatedData.price = updatedPrice;
    if(updatedStock) updatedData.stock = updatedStock;
    
    if(Object.values(updatedData).length === 0) return NextResponse.json({message:"Price or stock is required"}, {status:400});
    const product = await prisma.products.updateMany({
      where:{name},
      data: updatedData
    });

    return NextResponse.json({message:"Product updated", product, successful: true}, {status:200});

  } catch (error) {
    console.log("Update product error", error);
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