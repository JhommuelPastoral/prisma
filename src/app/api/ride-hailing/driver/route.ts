import { redis } from "@/lib/redis";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const {drivers} = await req.json();
    if(!drivers) return NextResponse.json({message:"All fields are required"}, {status:400});
    const driver = await prisma.driver.createMany({data:drivers});
    return NextResponse.json({message:"Driver created", driver}, {status:200});
  } catch (error) {
    console.log("Create driver error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}

export async function GET(req:Request) {
  try {
    const drivers = await prisma.driver.findMany();
    return NextResponse.json({message:"Driver fetched", drivers}, {status:200});
  } catch (error) {
    console.log("Get driver error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}
