import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type Team= {
  team: string;
  members: Member[];
}

type Member = {
  name: string;
  messages: number;
  score: number
}
export async function POST(req:Request) {
  try {
    const {team} = await req.json();
    if(!team) return NextResponse.json({message:'Team is required', successful: false}, {status:400});
    if(team.length === 0) return NextResponse.json({message:'Team is required', successful: false}, {status:400});
    const teamCreated = await prisma.team.createMany({
      data: team
    });
    return NextResponse.json({message: "Team created", teamCreated, successful: true}, {status:200});

  } catch (error) {
    console.log("Create team error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});    
  }
}

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include:{members:{
        omit:{id: true},
        include:{message:{
          omit:{id: true},
          include:{reactions: {
            omit:{id: true}
          }}
        }}
      }}
    });
    const topTeamMembers : Team[] = [];
    for(const team of teams){
      if(team.members.length < 3) continue;
      const topThreeMembers : Member[] = [];
      team.members.forEach(member => {
        const totalReaction = member.message.reduce((acc, message) => acc += message.reactions.length, 0)
        const engagementScore = (member.message.length * 2) + totalReaction;
        if(engagementScore >= 10 && member.message.length >=5){
          const data = {
            name: member.name,
            messages: member.message.length,
            score : engagementScore
          }
          topThreeMembers.push(data);
        }
      });
      topThreeMembers.sort((a:Member,b:Member) => b.score - a.score);
      const data = {
        team : team.name,
        members : topThreeMembers.slice(0,3)
      };
      topTeamMembers.push(data);
    };
    return NextResponse.json({message:"Teams fetched", topTeamMembers, successful: true}, {status:200});
  } catch (error) {
    console.log("Get Teams error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}