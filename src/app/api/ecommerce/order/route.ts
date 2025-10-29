import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
 try {
  const users = await prisma.userEcomnmerce.findMany();
  const products = await prisma.product.findMany();
  for(const user of users){


  }
 } catch (error) {
  
 } 
}