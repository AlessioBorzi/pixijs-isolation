import { join } from "https://deno.land/std@0.149.0/path/posix.ts";
import { resolve } from "https://deno.land/std@0.179.0/path/mod.ts";
import express from "npm:express@4.18.2";
import { fromMeta } from "https://x.nest.land/dirname_deno@0.3.0/mod.ts";

const { __dirname } = fromMeta(import.meta);
const app = express();
const PORT = 3000;
const HOST = "127.0.0.1";

app.get("/", (req, res) => {
  res.sendFile(resolve("dist/index.html"));
});

app.use("/", express.static(join(__dirname, "../dist")));

app.listen(PORT);

console.log("Server running at " + HOST + ":" + PORT + "/");
