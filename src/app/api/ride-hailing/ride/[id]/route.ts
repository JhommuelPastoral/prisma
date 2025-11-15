import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";


type Drivers = {
  id: string;
  name: string;
  location: {latitude: number;longitude: number;};
}

type Rider = {
  id: string;
  name: string;
  pickUp:{lat:number;lng:number;} | null;
  destination:{lat:number;lng:number;} | null;
}

function isLatLng(obj: any): obj is { lat: number; lng: number } {
  return obj 
    && typeof obj === "object" 
    && "lat" in obj 
    && "lng" in obj 
    && typeof obj.lat === "number" 
    && typeof obj.lng === "number";
}

export async function GET(req:Request, {params} : {params : Promise<{id: string}>}) {
  try {
    const {id} = await params;
    const nearbyDrivers: Drivers[] = [];
    if(!id) return NextResponse.json({message:"Id is required"}, {status:400});
    const cachedRiderKey = `rider:${id}`;
    const cachedRider = await redis.get<Rider>(cachedRiderKey);
    let rider: Rider | null = cachedRider ?? null;
    
    if(!rider){
      const dbRider = await prisma.rider.findUnique({where:{id}});
      if(!dbRider) return NextResponse.json({message:"Rider not found"}, {status:404});
      const safePickUp = typeof dbRider.pickUp === "string" ? (() => {
        try {
          const parsedPickUp = JSON.parse(dbRider.pickUp);
          return isLatLng(parsedPickUp) ? parsedPickUp : null;
        } catch (error) {
          return null;
        }
      }) (): isLatLng(dbRider.pickUp) ? dbRider.pickUp : null; 
      
      const safeDestination = typeof dbRider.destination === "string" ? (() => {
        try {
          const parsedDestination = JSON.parse(dbRider.destination);
          return isLatLng(parsedDestination) ? parsedDestination : null;
        } catch (error) {
          return null;
        }
      }) (): isLatLng(dbRider.destination) ? dbRider.destination : null; 

      rider = {
        ...dbRider,
        pickUp: safePickUp,
        destination: safeDestination
      };
      await redis.set(cachedRiderKey, rider);
    }

    // Checked for nearby Drivers
    const cachedDrivers = await redis.get<Drivers[]>("drivers");
    let drivers: Drivers[] | null = cachedDrivers ?? null;
    if(!drivers){


    }







  } catch (error) {
    
  }
  
}