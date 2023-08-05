import { NextResponse } from 'next/server';  
import prismadb from "@/lib/prismadb"

export async function POST(req) {
  const { botName, url, file, userId } = await req.json();
  
  // Default value for themeString
  const themeString = JSON.stringify({}); // An empty theme configuration
  
  console.log(`Received request to create bot: ${botName}`);
  
  try {
    const bot = await prismadb.bot.create({
      data: {
        botName,
        url,
        file,
        userId,
        themeString,  // Include the default value
      },
    });

    console.log(`Bot created successfully: ${bot}`);
    return NextResponse.json(bot);
  } catch (error) {
    console.error(`Unable to save bot: ${error}`);
    return new NextResponse('Unable to save bot', { status: 500 });
  }
}
