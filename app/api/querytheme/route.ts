import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";

export async function GET(req) {
  try {
    console.log(req.query);
    const { botName } = req.query;

    const bot = await prismadb.bot.findUnique({
      where: {
        botName,
      },
    });

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 });
    }

    return NextResponse.json(bot.themeString);
  } catch (error) {
    console.error(`Unable to fetch bot: ${error}`);
    return new NextResponse("Unable to fetch bot", { status: 500 });
  }
}
