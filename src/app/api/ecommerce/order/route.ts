import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


type ProductsInterface = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

type OrderItemsInterface = {
  productId: string;
  quantity: number;
  priceAtBuy: number;
}


function generateRandomOrderItems(products: ProductsInterface[]) : OrderItemsInterface[] {
  const randomLength = Math.floor(Math.random() * 10) + 1;
  const items : OrderItemsInterface[] = [];
  for(let i = 0; i < randomLength; i++){
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomQuantity = Math.floor(Math.random() * 10 + 1);
    const PriceAtBuy = randomProduct.price;
    items.push({productId: randomProduct.id, quantity: randomQuantity, priceAtBuy: PriceAtBuy});
  }
  return items;
}

export async function POST(req:Request) {
 try {
  const users = await prisma.userEcomnmerce.findMany();
  const products = await prisma.product.findMany();

  for(const user of users){
    const UserId = users[Math.floor(Math.random() * users.length)].id;
    const items = generateRandomOrderItems(products);
    const total = items.reduce((acc, item) => acc + item.priceAtBuy * item.quantity, 0);
    await prisma.order.create({data: {userId: UserId, items: {createMany: {data: items}}, total}}); 
  }

  return NextResponse.json({message:"Order created", successful: true}, {status:200});
 } catch (error) {
    console.log("Create order error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
 } 
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({include: {items: true}});
    return NextResponse.json({message:"Orders fetched", orders, successful: true}, {status:200});
  } catch (error) {
    console.log("Get orders error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}