#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const SRC = process.env.SRC || path.resolve(os.homedir(), "vimwiki/diary");
const OUT = process.env.OUT || path.resolve(os.tmpdir(), "diary-build");

if (!fs.existsSync(SRC)) {
  console.log("vimwiki SRC dir does not exists: " + SRC);
  process.exit();
}

if (!fs.existsSync(OUT)) {
  fs.mkdirSync(OUT);
}

const diaryEntries = fs.readdirSync(SRC);
const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <link
    rel='stylesheet'
    href='https://cdnjs.cloudflare.com/ajax/libs/marx/3.0.7/marx.min.css'
    integrity='sha512-gIfBOM+mjygWMgT6b/dqLds7xc9UxAoN+04jxTdg7oLrqJC8dGdbgGU4ddwPDxOeluhkm+0fsIpFLKwrRBxmGQ=='
    crossorigin='anonymous'
  />
  <link rel='preconnect' href='https://fonts.gstatic.com' />
  <link
    href='https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;700&display=swap'
    rel='stylesheet'
  />
  <meta charset="UTF-8">
  <title>My Diary</title>
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <style>
    html,
    body {
      font-family: 'IBM Plex Serif', serif;
      max-width: 60rem;
      padding: 1rem;
      margin: auto;
    }
  </style>
</head>
<body>
  HTML_OUTPUT 
</body>
</html>
`;
let finalHTML = "";
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

for (let i in diaryEntries.reverse()) {
  if (diaryEntries[i] !== "diary.md") {
    const date = betterDate(new Date(diaryEntries[i].replace(/.md$/i, "")));
    const file = path.resolve(SRC, diaryEntries[i]);
    const html = execSync(`showdown makehtml -i "${file}"`).toString(
      "utf-8"
    );
    finalHTML += `<article>
        <h4>${date.toUpperCase()}</h4>
        <hr />
        ${html}
      </article>
      <div style="margin-bottom: 7rem"></div>
    `;
  }
}

fs.writeFileSync(
  path.resolve(OUT, "index.html"),
  template.replace("HTML_OUTPUT", finalHTML),
  { encoding: "utf-8" }
);

function betterDate(date) {
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}
