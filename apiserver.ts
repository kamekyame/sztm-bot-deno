import {
  createApp,
  createRouter,
} from "https://deno.land/x/servest@v1.3.1/mod.ts";

import { apiRoute as majiApiRoute } from "./maji-uranai-collect-bot/mod.ts";

const app = createApp();

app.route("/maji-uranai/", majiApiRoute());

app.listen({ port: 8899 });
