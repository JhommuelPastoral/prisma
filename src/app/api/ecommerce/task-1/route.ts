import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type ProductResult ={
  name: string;
  unitsSold: number;
  revenue: number;
}

type CategoryRevenue = {
  category: string;
  revenue: number;
};

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
        id: true,
        category: true,
        orderItems: true
      }
    });

    const result :ProductResult[] = groupIds.map((group) => {
      const product = products.find((product) => product.id === group.productId);
      if(!product) return null;
      const revenue = product.orderItems.reduce((total, item) => total + (item.priceAtBuy * item.quantity), 0);

      return {
        name: product.name,
        unitsSold: group._sum.quantity ?? 0,
        revenue: Number(revenue.toFixed(2)),
      }
    }).filter((item) => item !== null).sort((a:ProductResult, b:ProductResult) => b.revenue - a.revenue).slice(0, 10);

    const salesByCategory : Record<string, {category: string, revenue: number}> = {}

    for (const product of products) {
      const category = product.category;
      const revenue = product.orderItems.reduce(
        (total, item) => total + (item.priceAtBuy * item.quantity),
        0
      );

      if (salesByCategory[category]) {
        salesByCategory[category].revenue = Number((revenue + salesByCategory[category].revenue).toFixed(2) );
      } else {
        salesByCategory[category] = {
          category,
          revenue
        };
      }
    }

    const task1 = {
      totalRevenue: Number(totalOrder._sum.total.toFixed(2)),
      averageOrderValue,
      topProducts: result,
      salesByCategory: Object.values(salesByCategory).sort((a:CategoryRevenue, b:CategoryRevenue) => b.revenue - a.revenue)
    }
 

    return NextResponse.json({message:"Orders fetched", task1, successful: true}, {status:200});
  } catch (error) {
    console.log("Get users error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}