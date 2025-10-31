import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalOrder = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      _count: {
        id: true
      },
    });
    if(!totalOrder._sum.total || !totalOrder._count.id) return NextResponse.json({message:"Orders are required"}, {status:400});
    const averageOrderValue = Number((totalOrder._sum.total / totalOrder._count.id).toFixed(2));

    const groupIds = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
        priceAtBuy: true
      },
      _count: {
        id: true
      },
      
    });
    const productsId = groupIds.map((group) => group.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productsId
        }
      },
      select: {
        name: true,
        id: true
      }
    });

    const result = groupIds.map((group) => {
      const product = products.find((product) => product.id === group.productId);
      if(!product) return null;
      return {
        name: product.name,
        unitsSold: group._count.id,
        revenue: Number(((group._sum.priceAtBuy ? group._sum.priceAtBuy : 0 )* (group._sum.quantity ? group._sum.quantity : 0)).toFixed(2)),
      }
    }).sort((a:any, b:any) => b.revenue - a.revenue).slice(0, 10);



    const task1 = {
      totalRevenue: Number(totalOrder._sum.total.toFixed(2)),
      averageOrderValue,
      topProducts: result
    }
 

    return NextResponse.json({message:"Orders fetched", task1, successful: true}, {status:200});
  } catch (error) {
    console.log("Get users error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}