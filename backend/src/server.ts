import { config } from "./config.js";
import { pool } from "./database.js";
import { createApp } from "./app.js";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`Backend listening at http://localhost:${config.port}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  server.close();
  await pool.end();
  console.log("Database pool closed.");
  process.exit(0);
});
