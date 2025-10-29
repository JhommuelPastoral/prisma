import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const {products} = await req.json();
    if(!products) return NextResponse.json({successful: false}, {status:400}); 
    if(products.length === 0) return NextResponse.json({message:"Products are required"}, {status:400});
    const product = await prisma.product.createMany({
      data: products
    });
    return NextResponse.json({message:"Products created", product, successful: true}, {status:200});
  } catch (error) {
    console.log("Create product error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({message:"Products fetched", products, successful: true}, {status:200});
  } catch (error) {
    console.log("Get Products error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}