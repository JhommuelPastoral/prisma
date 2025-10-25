import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  try {
    const {post} = await req.json();
    if(!post) return NextResponse.json({message:"Post is required"}, {status:400});
    if(post.length === 0) return NextResponse.json({message:"Post is required"}, {status:400});
    const postCreated = await prisma.post.createMany({
      data: post
    });
    return NextResponse.json({message:"Post created", postCreated}, {status:200});
  } catch (error) {
    console.log("Create post error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});    
  }
};

export async function GET(req:Request) {
  try {
    const posts = await prisma.post.findMany({
      select:{ 
        createdAt: true,
        comments: {
          include:{
            _count: true
          }
        },
        _count:{ select:{
          comments:true,
          likes: true
        }},


        user: {
          select:{
            name: true,
          _count: {
            select: {
              post: true
            }
          }
          }
        }
      },
    });


    const now = new Date();
    const minimumDate = new Date();
    minimumDate.setDate(now.getDate() - 30);
    const highestEngagment = posts.filter(post => {
      if(post.createdAt > minimumDate && post._count.comments >= 2){
        return post;
      };
    }).map(post =>{
      const totalCommentlikes = post.comments.reduce((acc, comment) => acc + comment._count.likes, 0);
      const engagementScore = (post.user._count.post * 3) + (post._count.likes) + post._count.comments + totalCommentlikes;
      return {
        name : post.user.name,
        postCount: post.user._count.post,
        commentCount: post._count.comments,
        likeCount: post._count.likes,
        engagementScore
        
      }
    });

    return NextResponse.json({message:"Post created", highestEngagment}, {status:200});
  } catch (error) {
    console.log("Get post error", error);
    return NextResponse.json({message:"Something went wrong"}, {status:500});
  }
}