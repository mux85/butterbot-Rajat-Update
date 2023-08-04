import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(req) {
  console.log(req.body);
  try {
    const { userId } = auth(); 
    const { botName, url, file } = req.body;  // botName here is actually the bot's id

    console.log({ botName, url, file });

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bot = await prismadb.bot.findUnique({
      where: { botName: botName }, // Change this from id: botName to botName: botName
    });

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 });
    }

    // Concatenate the new URL and file to the existing ones with a comma
    // Only if they are not empty
    const updatedUrl = url ? bot.url + "," + url : bot.url;
    const updatedFile = file ? bot.file + "," + file : bot.file;

    await prismadb.bot.update({
      where: { botName: botName }, 
      data: { url: updatedUrl, file: updatedFile },
    });

    return new NextResponse("Bot updated successfully", { status: 200 });
  } catch (error) {
    console.error('Unable to update bot:', error);
    console.error({ botName, url, file });
    return new NextResponse("Unable to update bot", { status: 500 });
  }
}
