import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


// try {
//   const {variants} = await req.json();
//   if(!variants) return NextResponse.json({message:"Variants are required"}, {status:400});
//   if(variants.length === 0) return NextResponse.json({message:"Variants are required"}, {status:400});
//   const variant = await prisma.variant.createMany({
//     data: variants
//   });
//   return NextResponse.json({message:"Variants created", variant, successful: true}, {status:200});
// } catch (error) {
//   console.log("Create variant error", error);
//   return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
// }
const colors = [
  "Black",
  "White",
  "Gray",
  "Silver",
  "Gold",
  "Rose Gold",
  "Blue",
  "Navy Blue",
  "Sky Blue",
  "Red",
  "Maroon",
  "Pink",
  "Hot Pink",
  "Green",
  "Lime Green",
  "Olive",
  "Yellow",
  "Orange",
  "Purple",
  "Violet",
  "Lavender",
  "Beige",
  "Brown",
  "Tan",
  "Teal",
  "Cyan",
  "Mint Green",
  "Cream",
  "Charcoal",
  "Burgundy"
];
const sizes = ["S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];
function generateRandom(){
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomStock = Math.floor(Math.random() * 100);
  const randomPriceDelta = Math.floor(Math.random() * 100 + 100); 
  return {
    color: randomColor,
    size: randomSize,
    stock: randomStock,
    priceDelta: randomPriceDelta
  }
}

function getCategory(category: string) {
  switch (category) {
    case "Electronics":{
      const {color, stock, priceDelta} = generateRandom();
      return {color,stock,priceDelta};
    }

    case "Wearables":{
      const {color, stock, priceDelta} = generateRandom();
      return {color,stock,priceDelta};
    }

    case "Accessories":{
      const {color, stock, priceDelta} = generateRandom();
      return {color,stock,priceDelta};
    }

    case "Home":{
      const {color, stock, priceDelta} = generateRandom();
      return {color,stock,priceDelta};
    }

    case "Lifestyle":{
      const {color, stock, priceDelta, size} = generateRandom();
      return {color,stock,priceDelta, size};
    }

    case "Stationery":{
      const {color, stock, priceDelta} = generateRandom();
      return {color,stock,priceDelta};
    }
    
    case "Office":{
      const {color, stock, priceDelta} = generateRandom();
      return {color,stock,priceDelta};
    }

    case "Photography":{
      const {color, stock, priceDelta} = generateRandom();
      return {color,stock,priceDelta};
    }

    case "Personal Care":{
      const {color, stock, priceDelta} = generateRandom();
      return {color,stock,priceDelta};
    }
    
    default:
      const {color, stock, priceDelta} = generateRandom();
      return {color,stock,priceDelta};
  }

}
export async function POST() {

  try {
    const products = await prisma.product.findMany();
    for(const product of products){
      const variant = getCategory(product.category);
      await prisma.variant.create({
        data: {
          color: variant.color,
          size: variant.size,
          stock: variant.stock,
          priceDelta: variant.priceDelta,
          productId: product.id
        }
      })
    };
    return NextResponse.json({message:"Variants created", successful: true}, {status:200});
  } catch (error) {
    console.log("Create variant error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}

export async function GET(){
  try {
    const variant = await prisma.variant.findMany();
    return NextResponse.json({message:"Variants fetched", variant, successful: true}, {status:200});
  } catch (error) {
    console.log("Get Variants error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}

export async function DELETE() {
  try {
    const variant = await prisma.variant.deleteMany();
    return NextResponse.json({message:"Variants deleted", variant, successful: true}, {status:200});
  } catch (error) {
    console.log("Delete Variants error", error);
    return NextResponse.json({message:"Something went wrong", sucessful: false}, {status:500});
  }
}