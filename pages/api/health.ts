import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export default async function handler(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "GET") {
    return new NextResponse("use GET", { status: 405 });
  }

  try {
    const pingResponse = await redis.ping();
    if (pingResponse === "PONG") {
      // Optionally set a key to show activity
      await redis.set("last-health-check", new Date().toISOString());
      console.log("Successfully pinged Redis.");
      return new NextResponse("Redis is healthy.", { status: 200 });
    } else {
      console.error("Redis ping did not return PONG.");
      return new NextResponse("Redis ping failed.", { status: 500 });
    }
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    return new NextResponse("Error connecting to Redis.", { status: 500 });
  }
}
