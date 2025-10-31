import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orderItems = await prisma.orderItem.findMany({include: {product: true}}); 
    return NextResponse.json({message:"Order items fetched", orderItems, successful: true}, {status:200});
  } catch (error) {
    console.log("Get order items error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}