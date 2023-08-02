import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(req) {
  console.log(req.body);
  try {
    const { userId } = auth(); 
    const { botName, url, file } = req.body;  // changed botName to botNameFromUrl

    console.log({ botName, url, file });  // changed botName to botNameFromUrl

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bot = await prismadb.bot.findUnique({
      where: { botName: botName },  // changed botName to botNameFromUrl
    });

    if (!bot) {
      return new NextResponse("Bot not found", { status: 404 });
    }

    // Concatenate the new URL and file to the existing ones with a comma
    // Only if they are not empty
    const updatedUrl = url ? bot.url + "," + url : bot.url;
    const updatedFile = file ? bot.file + "," + file : bot.file;

    await prismadb.bot.update({
      where: { botName: botName },  // changed botName to botNameFromUrl
      data: { url: updatedUrl, file: updatedFile },
    });

    return new NextResponse("Bot updated successfully", { status: 200 });
  } catch (error) {
    console.error(`Unable to update bot: ${error}`);
    console.error({ botName, url, file });  // changed botName to botNameFromUrl
    return new NextResponse("Unable to update bot", { status: 500 });
  }
}
