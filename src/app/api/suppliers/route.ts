import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const {name, country} = await req.json();
    if(!name || !country) return NextResponse.json({message:"All fields are required"}, {status:400});
    const supplier = await prisma.supplier.create({data:{name, country}});
    return NextResponse.json({message:"Supplier created", supplier}, {status:200});
  
  } catch (error) {
    console.log("Create supplier error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});  
  }
}


export async function GET(){
  try {
    const suppliers = await prisma.supplier.findMany({
      include:{products :{
        omit:{supplierId: true}
      }},
    });
    if(!suppliers) return NextResponse.json({message:"Suppliers are required"}, {status:400});
    return NextResponse.json({message:"Suppliers fetched", suppliers, successful: true}, {status:200});
  } catch (error) {
    console.log("Get Suppliers error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
  
}