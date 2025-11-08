import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Monday Task 
// Rate Limiter
// Explore some commands
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


export async function GET(req:Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.replace("::ffff:","");
    return NextResponse.json({message:"User fetched", ip}, {status:200});
  } catch (error) {
    console.log("Get user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}
