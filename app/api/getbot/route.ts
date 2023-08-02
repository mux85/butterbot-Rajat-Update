import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(req) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bots = await prismadb.bot.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(bots);
  } catch (error) {
    console.error(`Unable to fetch bots: ${error}`);
    return new NextResponse("Unable to fetch bots", { status: 500 });
  }
}
