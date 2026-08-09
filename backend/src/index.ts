import "dotenv/config";
import app from "./app";
import { prisma } from "./generated/prisma";

const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    const count = await prisma.lead.count();
    res.json({ status: 'ok', leads: count, database: 'connected' });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      database_url_set: !!process.env.DATABASE_URL 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
