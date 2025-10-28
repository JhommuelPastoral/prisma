import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type User={
  name: string;
  email: string;
}

export async function POST(req:Request){
  try {
    const {users} : {users: User[]} = await req.json();
    if(!users) return NextResponse.json({successful: false}, {status:400});
    if(users.length === 0) return NextResponse.json({successful: false}, {status:400});
    const user = await prisma.userEcomnmerce.createMany({
      data: users
    });
    return NextResponse.json({user, successful: true}, {status:200});
  } catch (error) {
    console.log("Create user error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}