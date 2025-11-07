import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const carts = await prisma.cart.findMany({
      select:{
        id: true
      }
    });
    const products = await prisma.product.findMany({
      select: {
        id: true
      }
    });

    for(const cart of carts){
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const productRandomLength = Math.floor(Math.random() * 10 + 1);
      for(let i =0; i < productRandomLength; i++){
        const randomQuantity = Math.floor(Math.random() * 10 + 1);
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            quantity: randomQuantity,
            productId: randomProduct.id
          }
        })
      }
    }
    return NextResponse.json({message:"Cart items created", successful: true}, {status:200});

  } catch (error) {
    console.log("Create cart items error", error);
  }
}

export async function GET() {
  try {
    const cartItems = await prisma.cartItem.findMany();
    return NextResponse.json({message:"Cart items fetched", cartItems, successful: true}, {status:200});
  } catch (error) {
    console.log("Get cart items error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}
