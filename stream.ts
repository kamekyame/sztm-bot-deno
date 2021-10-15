import {
  changeRules,
  config,
  connectStream,
  getBearerToken,
  getRules,
  pathResolver,
  StreamParam,
} from "./deps.ts";

const resolve = pathResolver(import.meta);

import { Fortune } from "./fortune-bot/mod.ts";
import { Janken } from "./janken-bot/mod.ts";
import MajiUranaiCollect from "./maji-uranai-collect-bot/mod.ts";

import "./apiserver.ts";

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

const fortune = new Fortune(auth);
fortune.setReceiveUsername(receiveUsername);

const janken = new Janken(auth);
janken.setReceiveUsername(receiveUsername);

const majiUranaiCollect = new MajiUranaiCollect(auth);

/*await changeRules(bearerToken, {
  delete: { ids: ["1410767381161418761"] },
});*/
// Check rule
async function checkRule() {
  const needRules = [
    fortune.getRule(),
    janken.getRule(),
    majiUranaiCollect.getRule(),
  ];

  let rules = await getRules(bearerToken);
  const addRules = needRules.filter((needRule) =>
    !rules.data?.some((rule) => rule.value === needRule.value)
  );
  if (addRules.length > 0) {
    console.log("addRules", addRules);
    const aRules = await changeRules(bearerToken, { add: addRules });
    console.log(aRules);
  }
  rules = await getRules(bearerToken);
  console.log("Rules", rules.data);
}
await checkRule();

const option: StreamParam = {
  ...fortune.option,
  ...janken.option,
  ...majiUranaiCollect.option,
};
console.log("option", option);

await connectStream(
  bearerToken,
  (res) => {
    console.log(res);
    fortune.callback(res);
    janken.callback(res);
    majiUranaiCollect.callback(res);
  },
  option,
);

Deno.exit(1);
