import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { allProjects } from "contentlayer/generated";

const redis = Redis.fromEnv();

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  if (req.method !== "GET") {
    return new NextResponse("use GET", { status: 405 });
  }

  try {
    // Get all project slugs
    const slugs = allProjects.map((p) => ["pageviews", "projects", p.slug].join(":"));
    
    // Get view counts for all projects
    const viewCounts = await redis.mget<number[]>(...slugs);
    
    // Create a mapping of slug to view count
    const viewsData = allProjects.reduce((acc, project, index) => {
      acc[project.slug] = viewCounts[index] ?? 0;
      return acc;
    }, {} as Record<string, number>);

    return new NextResponse(JSON.stringify(viewsData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching views:", error);
    return new NextResponse("Error fetching views", { status: 500 });
  }
}
