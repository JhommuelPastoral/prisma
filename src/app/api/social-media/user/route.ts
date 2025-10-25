import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const {user} = await req.json();
    if(!user) return NextResponse.json({message:"User is required"}, {status:400});

    const createdUser = await prisma.user.createMany({
      data:user
    });
    return NextResponse.json({message:"User created", createdUser}, {status:200});
  } catch (error) {
    console.log("Create user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}