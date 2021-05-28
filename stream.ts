import { config } from "https://deno.land/x/dotenv/mod.ts";

import { pathResolver } from "https://kamekyame.github.io/deno_tools/path/mod.ts";
const resolve = pathResolver(import.meta);

import { getBearerToken } from "https://kamekyame.github.io/twitter_api_client/auth/oauth2.ts";
import {
  connectStream,
} from "https://kamekyame.github.io/twitter_api_client/api_v2/tweets/filtered_stream.ts";

import { Fortune } from "./fortune-bot/mod.ts";
import { Janken } from "./janken-bot/mod.ts";
import MajiUranaiCollect, { option } from "./maji-uranai-collect-bot/mod.ts";

const env = config({
  path: resolve("./.env"),
  safe: true,
  example: resolve("./.env.example"),
});

const auth = {
  consumerKey: env["API_KEY"],
  consumerSecret: env["API_SECRETKEY"],
  token: env["TOKEN"],
  tokenSecret: env["TOKEN_SECRET"],
};

const bearerToken = await getBearerToken(auth.consumerKey, auth.consumerSecret);

//const receiveUsername = "botTest46558316";
const receiveUsername = "SuzuTomo2001";

const fortune = new Fortune(auth, bearerToken);
fortune.setReceiveUsername(receiveUsername);
await fortune.checkRule();

const janken = new Janken(auth, bearerToken);
janken.setReceiveUsername(receiveUsername);
await janken.checkRule();

const majiUranaiCollect = new MajiUranaiCollect(auth, bearerToken);
await majiUranaiCollect.checkRule();

connectStream(
  bearerToken,
  (res) => {
    fortune.callback(res);
    janken.callback(res);
    majiUranaiCollect.callback(res);
  },
  Object.assign({
    expansions: {
      author_id: true,
    },
    "user.fields": {
      username: true,
    },
  }, option),
);
