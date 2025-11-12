import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
  try {
    const riders = await prisma.rider.findMany();
    for(const ride of riders){
      const cachedRiderKey = `rider:${ride.id}`;
      await redis.set(cachedRiderKey, ride);
    }
    const [cursor, keys] = await redis.scan(0, {match: "rider:*", count:2});
    // for(const key of keys){
    //   await redis.del(key);
    // }

    return NextResponse.json({message:"Rider fetched", keys, cursor}, {status:200});

  } catch (error) {
    console.log("Get rider error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
  
}