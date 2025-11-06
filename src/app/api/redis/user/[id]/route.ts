import { redis } from "@/lib/redis";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type User ={
  id: string;
  name: string;
  age: number;
}
export async function GET(req:Request,{params} : {params : Promise<{id: string}>}) {
  try {
    const {id} = await params;
    if(!id) return NextResponse.json({message:"Id is required"}, {status:400});
    const cachedKey = `user:${id}`;

    const cachedUser = await redis.get<User>(cachedKey);
    if(cachedUser) return NextResponse.json({message:"User fetched from cache", user: cachedUser}, {status:200});
    const user = await prisma.redisUser.findUnique({where:{id}});
    await redis.set(cachedKey, user, {ex: 3600} );
    return NextResponse.json({message:"User fetched from database", user}, {status:200});
  } catch (error) {
    console.log("Get user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }

}

export async function PUT(req:Request, {params} :{params: Promise<{id: string}>}) {
  try {
    const {id} = await params;
    const cachedKey = `user:${id}`; 
    if(!id) return NextResponse.json({message:"Id is required"}, {status:400});
    const {age, name} = await req.json();
    if(!name || !age) return NextResponse.json({message:"All fields are required"}, {status:400});
    const user = await prisma.redisUser.update({where:{id}, data:{name, age}});
    await redis.del(cachedKey);
    return NextResponse.json({message:"User updated", user}, {status:200});
  } catch (error) {
    console.log("Update user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }


}

