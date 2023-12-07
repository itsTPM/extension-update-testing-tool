const state = require("./state");
const utils = require("./utils");
const { mkdir, readFile, writeFile } = require("fs/promises");
const path = require("path");
const AdmZip = require("adm-zip");

const express = require("express");

const app = express();

app.use("/", express.static("public"));

app.get("/status", require("./routes/status"));

app.get(
  "/extension.crx",
  utils.requireExtensionMiddleware,
  require("./routes/extension")
);

app.get(
  "/updates.xml",
  utils.requireExtensionMiddleware,
  require("./routes/updates")
);

app.get(
  "/policy.mobileconfig",
  utils.requireExtensionMiddleware,
  require("./routes/policy")
);

app.listen(state.PORT);
console.log(`Listening at http://localhost:${state.PORT}...`);

async function handleZip() {
  const filePath = path.join("../src.zip");
  const file = await readFile(filePath);
  
  await writeFile("tmp/extension.zip", file);

  const zip = new AdmZip("tmp/extension.zip");

  await mkdir("tmp/unpacked", { recursive: true });

  await new Promise((resolve, reject) =>
    zip.extractAllToAsync("tmp/unpacked", true, false, (err) => {
      if (err) reject(err);
      resolve(undefined);
    })
  );
}

handleZip();