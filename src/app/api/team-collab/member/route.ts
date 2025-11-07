import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type Member = {
  name: string;
  role: string;
  teamId: string;
}

export async function POST(req:Request) {
  try {
    const {member} : {member: Member[]} = await req.json();
    if(!member) return NextResponse.json({message:'Member is required', successful: false}, {status:400});
    if(member.length === 0) return NextResponse.json({message:'Member is required', successful: false}, {status:400});
    const memberCreated = await prisma.member.createMany({
      data: member
    });
    return NextResponse.json({message: "Team created", memberCreated, successful: true}, {status:200});

  } catch (error) {
    console.log("Create team error", error);    
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include:{team: true,
        message:{
          include:{reactions : {
            omit:{id:true}
          }}
        }
      }
    });
    return NextResponse.json({message:"Members fetched", members, successful: true}, {status:200});
  } catch (error) {
    console.log("Get Members error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}