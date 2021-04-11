#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

console.log(process.env.SRC, process.env.OUT);

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
    href='https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap'
    rel='stylesheet'
  />
  <meta charset="UTF-8">
  <title>Logs - 2021</title>
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <style>
    html,
    body {
      font-family: 'IBM Plex Mono', serif;
      max-width: 60rem;
      margin: auto;
    }

    body {
      padding: 1rem;
    }

    code {
      background-color: #5465ff18;
      padding: 0 4px;
      border-radius: 0.3rem;
    }

    ol, ul {
      padding-left: 1.5rem;
    }
  </style>
</head>
<body>
  HTML_OUTPUT 
</body>
</html>
`;
let finalHTML = "";

const dayOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

for (let i in diaryEntries.reverse()) {
  if (diaryEntries[i] !== "diary.md" && diaryEntries[i] !== ".git") {
    const date = betterDate(new Date(diaryEntries[i].replace(/.md$/i, "")));
    const file = path.resolve(SRC, diaryEntries[i]);

    const html = execSync(`showdown makehtml -i "${file}"`).toString("utf-8");
    finalHTML += `
      <article 
        style="
          padding: 1rem; 
          box-shadow:
            0 1.2px 17.2px rgba(0, 0, 0, 0.021),
            0 3.4px 47.5px rgba(0, 0, 0, 0.03),
            0 8.1px 114.3px rgba(0, 0, 0, 0.039),
            0 27px 379px rgba(0, 0, 0, 0.06);
          border-radius: 1rem;
          background-color: #fff;
        "
      >
        <div
          id="${date.dateStr}"
          style="display: inline-block"
        >
          <a style="color: inherit" href="#${date.dateStr}">
            ${date.formatted}
          </a>
        </div>

        ${html}
      </article>
    `;
  }
}

fs.writeFileSync(
  path.resolve(OUT, "index.html"),
  template.replace("HTML_OUTPUT", finalHTML),
  { encoding: "utf-8" }
);

function betterDate(date) {
  const day = (date.getDate() + "").padStart(2, 0);
  const month = (date.getMonth() + 1 + "").padStart(2, 0);
  const weekDay = dayOfWeek[date.getDay()];
  //const year = date.getFullYear();

  const formatted = `
  <p style="color: darkred">
    <span style="font-size: 1.4em">${day}&middot;${month}</span><br/>
    <span style="letter-spacing: 4px; font-size: 0.8em">${weekDay.toUpperCase()}</span>
  </p>`;

  return { dateStr: date.toUTCString(), formatted };
}
