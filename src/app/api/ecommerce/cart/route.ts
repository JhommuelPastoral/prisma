import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const users = await prisma.userEcomnmerce.findMany();
    for(const user of users){
      await prisma.cart.create({
        data: {
          userId: user.id
        }
      })      
    }
    return NextResponse.json({message:"Cart created", successful: true}, {status:200}); 
  } catch (error) {
    console.log("Create cart error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}

export async function GET() {
  try {
    const cart = await prisma.cart.findMany({
      include:{
        _count: true
      }
    });
    return NextResponse.json({message:"Cart fetched", cart, successful: true}, {status:200});
  } catch (error) {
    console.log("Get cart error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}