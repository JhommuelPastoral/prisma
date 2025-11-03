import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(req:Request, {params}: {params: Promise<{id: string}>}) {
  try {
    const {id} = await params;
    const cachedKey= `user:${id}`;

    // Get Cached
    const cached = await redis.get(cachedKey);
    if(cached) return NextResponse.json({cached, message:"User fetched from cached"}, {status:200});

    const user = await prisma.redisUser.findUnique({where:{id}});

    if(!user) return NextResponse.json({message:"User not found", successful: false}, {status:404});
    // Set Cache
    await redis.set(cachedKey, JSON.stringify(user));
    return NextResponse.json({message:"User fetched", successful: true}, {status:200});
  } catch (error) {
    console.log("Get user error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}
