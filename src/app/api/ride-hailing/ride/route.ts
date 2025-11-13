import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

type Driver = {
  id: string;
  name?: string;
  location: { latitude: number; longitude: number } | null;
};

type Rider = {
  id: string;
  name?: string;
  pickUp: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
};

// Type guard for driver location
function isLatLng(obj: any): obj is { lat: number; lng: number } {
  return obj 
    && typeof obj === "object" 
    && "lat" in obj 
    && "lng" in obj 
    && typeof obj.lat === "number" 
    && typeof obj.lng === "number";
}

export async function GET(req: Request) {
  try {
    // Fetch rider
    const rawRider = await prisma.rider.findFirst();
    if (!rawRider) return NextResponse.json({ message: "Rider not found" }, { status: 404 });
    if (!rawRider.pickUp) return NextResponse.json({ message: "Rider pickup not set" }, { status: 400 });

    // Parse rider pickUp safely
    const rider: Rider = {
      ...rawRider,
      pickUp: typeof rawRider.pickUp === "string" 
        ? JSON.parse(rawRider.pickUp) as { lat: number; lng: number }
        : rawRider.pickUp as { lat: number; lng: number },
      destination: rawRider.destination 
        ? typeof rawRider.destination === "string" 
          ? JSON.parse(rawRider.destination) as { lat: number; lng: number }
          : rawRider.destination as { lat: number; lng: number }
        : undefined, // convert null to undefined
    };


    // First, check cached drivers in Redis
    const [cursor, cachedDrivers] = await redis.scan(0, { match: "drivers:*" });
    if (cachedDrivers.length > 0) {
      for (const key of cachedDrivers) {
        const driver = await redis.get<Driver>(key);
        if (!driver?.location) continue;

        const distance = Math.sqrt(
          Math.pow(driver.location.latitude - rider.pickUp.lat, 2) +
          Math.pow(driver.location.longitude - rider.pickUp.lng, 2)
        );
        console.log(`[Redis] Driver ${driver.id} distance:`, distance);
      }
    }

    // Fetch all drivers from DB
    const drivers = await prisma.driver.findMany({ select: { id: true, location: true } });

    for (const driver of drivers) {
      if (!driver.location) continue;

      let locationObj: { latitude: number; longitude: number } | null = null;

      // Parse string JSON if needed
      if (typeof driver.location === "string") {
        try {
          const parsed = JSON.parse(driver.location);
          if (isLatLng(parsed)) {
            locationObj = { latitude: parsed.lat, longitude: parsed.lng };
          }
        } catch {
          console.log("Invalid JSON for driver:", driver.id);
          continue;
        }
      } else if (isLatLng(driver.location)) {
        // Already object with lat/lng
        locationObj = { latitude: driver.location.lat, longitude: driver.location.lng };
      }

      if (!locationObj) {
        console.log("Invalid location object:", driver.location);
        continue;
      }

      // Calculate distance
      const distance = Math.sqrt(
        Math.pow(locationObj.latitude - rider.pickUp.lat, 2) +
        Math.pow(locationObj.longitude - rider.pickUp.lng, 2)
      );

      console.log(`[DB] Driver ${driver.id} distance:`, distance);
    }

    return NextResponse.json({ message: "Rider fetched", rider }, { status: 200 });

  } catch (error) {
    console.log("Get rider error", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
