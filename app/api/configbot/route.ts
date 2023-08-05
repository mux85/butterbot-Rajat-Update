import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(req) {
  try {
    const { userId } = auth(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { botId, themeString } = await req.json();

    const bot = await prismadb.bot.findUnique({
      where: { botName: botId },
    });
    console.log('Bot to update:', bot);

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 });
    }

    await prismadb.bot.update({
      where: { id: bot.id },
      data: { themeString },
    });

    return new NextResponse("Bot theme updated successfully", { status: 200 });
  } catch (error) {
    console.error('Unable to update bot theme:', error);
    return new NextResponse("Unable to update bot theme", { status: 500 });
  }
}
