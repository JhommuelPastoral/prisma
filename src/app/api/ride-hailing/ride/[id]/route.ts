import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(req:Request, {params} : {params : Promise<{id: string}>}) {
  try {
    const {id} = await params;
    if(!id) return NextResponse.json({message:"Id is required"}, {status:400});

    const cachedRiderKey = `rider:${id}`;
    const cachedRider = await redis.get(cachedRiderKey);
    if(!cachedRider) return NextResponse.json({message:"Rider not found, from cache"}, {status:200});
    await redis.set(cachedRiderKey, cachedRider);


  } catch (error) {
    
  }
  
}