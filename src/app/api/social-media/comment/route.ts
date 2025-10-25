import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const {comment} = await req.json();
    if(!comment) return NextResponse.json({message:"Comment is required"}, {status:400});
    if(comment.length === 0) return NextResponse.json({message:"Comment is required"}, {status:400});
    const commentCreated = await prisma.comments.createMany({
      data: comment
    });
    return NextResponse.json({message:"Comment created", commentCreated}, {status:200});
  } catch (error) {
    console.log("Create comment error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}