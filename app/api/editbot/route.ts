import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(req) {
  try {
    const { userId } = auth(req); 

    console.log("UserId: ", userId);
    
    const { botId, url, file } = await req.json();  // Extract botId from request body

    console.log("Received botId, url, file: ", botId, url, file);

    if (!userId) {
      console.log("Unauthorized request. User not logged in.");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Searching for bot with botId: ", botId);
    const bot = await prismadb.bot.findUnique({
      where: { id: botId },  // Change botName to id
    });

    console.log("Bot from database: ", bot);

    if (!bot) {
      console.log("Bot not found in database.");
      return new NextResponse("Bot not found", { status: 404 });
    }

    // Concatenate the new URL and file to the existing ones with a comma
    // if type is 'URL', update the url field
    const updatedUrl = url ? (bot.url ? bot.url + "," + url : url) : bot.url;
    // if type is 'PDF', update the file field
    const updatedFile = file ? (bot.file ? bot.file + "," + file : file) : bot.file;

    console.log("Updating bot with new url and file: ", updatedUrl, updatedFile);

    await prismadb.bot.update({
      where: { id: botId },  // Change botName to id
      data: { url: updatedUrl, file: updatedFile },
    });

    console.log("Bot updated successfully.");
    return new NextResponse("Bot updated successfully", { status: 200 });
  } catch (error) {
    console.error('Unable to update bot:', error);
    console.error('botId, url, file values: ', { botId, url, file });
    return new NextResponse("Unable to update bot", { status: 500 });
  }
}
