const { readFile, writeFile } = require("fs/promises");
const crx = require("./crx");
const state = require("./state");
require('dotenv').config()

module.exports.makeUploadHandler = function (unpack) {
  return async () => {
    if (unpack) {
      await unpack();
    }

    let manifestBuffer;

    try {
      manifestBuffer = await readFile("tmp/unpacked/manifest.json");
    } catch (e) {
      return console.log("Не удалось прочесть manifest.json");
    }

    let manifest;

    try {
      manifest = JSON.parse(manifestBuffer.toString("utf-8"));
    } catch (e) {
      return console.log("Не удалось спарсить manifest.json");
    }

    manifest.update_url = `${process.env.URL}:${state.PORT}/updates.xml`;

    try {
      await writeFile("tmp/unpacked/manifest.json", JSON.stringify(manifest));
    } catch (e) {
      return console.log("Не удалось записать обновленный manifest.json");
    }

    if (!manifest.name || !manifest.version) {
      return console.log(
        "Manifest не содержит name или version"
      );
    }

    let id, packed;

    try {
      const result = await crx.createCrx("tmp/unpacked");
      id = result.id;
      packed = result.packed;
    } catch (e) {
      return console.log("Не удалось подписать crx.");
    }

    try {
      await writeFile("tmp/extension.crx", packed);
    } catch (e) {
      return console.log("Не удалось записать crx на диск.");
    }

    state.setExtension(id, manifest.name, manifest.version);
  };
};

module.exports.requireExtensionMiddleware = async function (req, res, next) {
  if (!state.getExtension()) {
    res.status(404);
    res.send("Расширение не найдено.");
    return;
  }
  next();
};
