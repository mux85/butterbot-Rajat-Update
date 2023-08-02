import { NextResponse } from 'next/server';  // Add this line
import prismadb from "@/lib/prismadb"

export async function POST(req) {
  const { botName, url, file, userId } = await req.json();  // Make sure to await req.json()
  
  console.log(`Received request to create bot: ${botName}`);
  
  try {
    const bot = await prismadb.bot.create({
      data: {
        botName,
        url,
        file,
        userId,
      },
    });

    console.log(`Bot created successfully: ${bot}`);
    return NextResponse.json(bot);  // Use NextResponse here
  } catch (error) {
    console.error(`Unable to save bot: ${error}`);
    return new NextResponse('Unable to save bot', { status: 500 });  // And here
  }
}
