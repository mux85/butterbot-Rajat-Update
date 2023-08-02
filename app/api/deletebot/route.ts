import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(req) {
  try {
    const { botId } = await req.json();  // Extract botId from request body
    const { userId } = auth(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prismadb.bot.delete({
      where: {
        id: botId,
        userId,
      },
    });

    return new NextResponse("Bot deleted successfully");
  } catch (error) {
    console.error(`Unable to delete bot: ${error}`);
    return new NextResponse("Unable to delete bot", { status: 500 });
  }
}
