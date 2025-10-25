import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const {post} = await req.json();
    if(!post) return NextResponse.json({message:"Post is required"}, {status:400});
    if(post.length === 0) return NextResponse.json({message:"Post is required"}, {status:400});
    const postCreated = await prisma.post.createMany({
      data: post
    });
    return NextResponse.json({message:"Post created", postCreated}, {status:200});
  } catch (error) {
    console.log("Create post error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});    
  }
}