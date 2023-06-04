import { join, resolve } from "https://deno.land/std@0.149.0/path/posix.ts";
import { fromMeta } from "https://x.nest.land/dirname_deno@0.3.0/mod.ts";
import express from "npm:express@4.18.2";

const { __dirname } = fromMeta(import.meta);
const app = express();
const PORT = 3000;
const HOST = "127.0.0.1";

app.get("/", (req, res) => {
  res.sendFile(resolve(join(__dirname, "../dist/index.html")));
});

app.get("/room/:partyKey", (req, res) => {
  res.sendFile(resolve(join(__dirname, "../dist/index.html")));

  res.send(req.params);
});

app.use("/", express.static(join(__dirname, "../dist")));

app.listen(PORT);

console.log("Server running at " + HOST + ":" + PORT + "/");
