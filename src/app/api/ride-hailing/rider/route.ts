import { redis } from "@/lib/redis";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){
  try {
    const {riders} = await req.json();
    if(!riders) return NextResponse.json({message:"All fields are required"}, {status:400});
    const rider = await prisma.rider.createMany({data:riders});
    return NextResponse.json({message:"Rider created", rider}, {status:200});
  } catch (error) {
    console.log("Create rider error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}
export async function GET(req:Request){
  try {
    const riders = await prisma.rider.findMany();
    return NextResponse.json({message:"Rider fetched", riders}, {status:200});
  } catch (error) {
    console.log("Get rider error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}