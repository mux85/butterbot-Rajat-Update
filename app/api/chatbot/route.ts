import prismadb from "@/lib/prismadb"

export default async function handle(req, res) {
  const { botName, url, file, userId } = req.body;
  
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
    res.status(200).json(bot);
  } catch (error) {
    console.error(`Unable to save bot: ${error}`);
    res.status(500).json({ error: "Unable to save bot" });
  }
}
