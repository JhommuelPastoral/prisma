import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type Message ={
  content: string, 
  memberId: string
};

export async function POST(req:Request) {
  try {
    const {message} : {message: Message[]} = await req.json();
    if(!message) return NextResponse.json({message:'Message is required', successful: false}, {status:400});
    if(message.length === 0) return NextResponse.json({message:'Message is required', successful: false}, {status:400});
    const messageCreated = await prisma.message.createMany({
      data: message,
    });
    return NextResponse.json({message: "Message created", messageCreated, successful: true}, {status:200});

  } catch (error) {
    console.log("Create message error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}