#!/usr/bin/env node

import fs from "fs";
import path from "path";

function cleanUpAppJS(pattern, replacement) {
  const fileContent = fs.readFileSync("src/App.js", { encoding: "utf-8" });
  const result = fileContent.replace(pattern, replacement);

  fs.writeFileSync("src/App.js", result, { encoding: "utf-8" });
}

function cleanIndexJS() {
  const fileContent = fs.readFileSync("src/index.js", { encoding: "utf-8" });
  const result = fileContent.replace(
    "import registerServiceWorker from './registerServiceWorker';",
    ""
  );

  fs.writeFileSync("src/index.js", result, { encoding: "utf-8" });
}

function createComponentDir() {
  try {
    fs.mkdirSync("src/components");
  } catch (ex) {
    console.log(ex.message);
  }
}

function removeFiles() {
  const files = fs.readdirSync("src/");

  for (let file of files) {
    if (file.match(/(svg|register)/i)) fs.unlinkSync(path.resolve("src", file));
  }
}

function deleteReadme() {
  fs.unlinkSync("README.md");
}

try {
  cleanUpAppJS("import logo from './logo.svg';", "");
  cleanUpAppJS(/\<div ([\S \s]+) <\/div>/i, "<div className='App'> </div>");
  cleanIndexJS();
  createComponentDir();
  removeFiles();
  deleteReadme();
} catch (ex) {
  console.log(ex.stack);
}
