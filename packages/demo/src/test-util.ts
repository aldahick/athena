import { randomInt } from "node:crypto";
import { Application, container } from "@athenajs/core";
import { main } from "./main.js";

export const withTestApp = async (
  callback: (url: string, app: Application) => Promise<void>,
) => {
  const port = randomInt(16384, 65536).toString();
  process.env.HTTP_PORT = port;
  const app = await main();
  try {
    await callback(`http://localhost:${port}`, app);
  } finally {
    await app.stop();
    container.clearInstances();
  }
};
