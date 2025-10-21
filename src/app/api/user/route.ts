import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if(!name || !email || !password) {
      NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where:{email}
    });

    if(existingUser) {
      return NextResponse.json({Message:"User already exists"}, {status: 400});
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });
    return NextResponse.json({Message:"User created",user}, {status: 200});
  } catch (error) {

    console.log("Create user error", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }  


}