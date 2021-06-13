import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import { execSync } from "child_process";

const TEMP_DIR = path.resolve(os.tmpdir(), "git");

/*
 * Repo Info Format:
 * [
 *    ["where to clone(in local disk)", "from where to clone", "where to push"]
 * ]
 */
const REPO_INFO = [
  [
    "dotfiles",
    "https://github.com/abdus/dotfiles",
    "git@github.com:another-nerd/dotfiles.git",
  ],
];

// git clone
function sync(REPO_INFO) {
  for (let repoInfo of REPO_INFO) {
    const base = path.resolve(TEMP_DIR, repoInfo[0]);

    // clean base dir
    fs.existsSync(TEMP_DIR) && fs.rmdirSync(TEMP_DIR, { recursive: true });

    // clone repo in tmp location
    execSync(`git clone ${repoInfo[1]} ${base}`, { stdio: "inherit" });

    // add upstream and push
    execSync(
      `cd ${base} && git remote add upstream ${repoInfo[2]} && git push --all upstream`,
      { stdio: "inherit" }
    );
  }
}

sync(REPO_INFO);
