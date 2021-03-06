const fs = require("fs-extra");
const path = require("path");
const Zip = require("adm-zip");

const unzip = async (source, destination) => {
  if (!path.isAbsolute(source)) {
    throw new Error("Source is not absolute");
  }
  if (!path.isAbsolute(destination)) {
    throw new Error("Destination is not absolute");
  }
  try {
    if (!(await fs.stat(source)).isFile()) {
      throw new Error("Not a file");
    }
  } catch (e) {
    throw new Error(`Source: ${e.message}`);
  }

  await fs.ensureDir(destination);
  const zip = new Zip(source);
  let outputDirectory;

  //zip.extractAllTo(destination, true);
  const entries = zip.getEntries();

  for (entry of entries) {
    if (!entry.isDirectory) {
      const regex = /[/|(\\|\\\\)]/;
      const allDirs = entry.entryName.split(regex);
      entry.entryName = allDirs.join("/");
      if (allDirs.length <= 1) continue;
      if (!outputDirectory) {
        outputDirectory = allDirs[0];
      }
    }
  }

  if (!outputDirectory) {
    throw new Error("Bad file");
  }
  zip.extractAllTo(destination);

  return path.join(destination, outputDirectory);
};

module.exports = unzip;
