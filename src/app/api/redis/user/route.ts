import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {name, age} = await req.json();
    if(!name || !age) return NextResponse.json({message:"All fields are required"}, {status:400});
    const user = await prisma.redisUser.create({data:{name, age}});
    return NextResponse.json({message:"User created", user}, {status:200});
  } catch (error) {
    console.log("Create user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }  
  
}

export async function GET(req: Request) {
  
}
