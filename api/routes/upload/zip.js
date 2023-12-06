const { mkdir, readFile, writeFile } = require("fs/promises");
const path = require("path");
const AdmZip = require("adm-zip");
const utils = require("../../utils");

module.exports = utils.makeUploadHandler(async () => {
  const filePath = path.join("C:/Users/Lyosha/Downloads/Downloads.zip");
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
});