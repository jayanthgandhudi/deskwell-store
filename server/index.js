import { openDb } from "./db.js";
import { createApp } from "./app.js";

const port = process.env.PORT || 3001;
const db = openDb();

createApp(db).listen(port, () => {
  console.log(`Deskwell API running on http://localhost:${port}`);
});
