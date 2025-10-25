import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const {likesData} =  await req.json();
    if(!likesData) return NextResponse.json({message:"Likes is required"}, {status:400});
    if(likesData.length === 0) return NextResponse.json({message:"Likes is required"}, {status:400});
    const likesCreated = await prisma.likes.createMany({
      data: likesData
    });
    return NextResponse.json({message:"Likes created", likesCreated}, {status:200});

  } catch (error) {
    console.log("Create likes error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}