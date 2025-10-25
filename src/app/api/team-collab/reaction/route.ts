import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const {reaction} = await req.json();
    if(!reaction) return NextResponse.json({message:'Reaction is required', successful: false}, {status:400});
    if(reaction.length === 0) return NextResponse.json({message:'Reaction is required', successful: false}, {status:400});
    const reactionCreated = await prisma.reaction.createMany({
      data: reaction
    });
    return NextResponse.json({message: "Reaction created", reactionCreated, successful: true}, {status:200});
  } catch (error) {
    console.log("Create reaction error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}