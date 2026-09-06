// Builds a static-export copy of the site for GitHub Pages.
// Admin pages, API routes, and middleware require a real server and can't be
// statically exported, so they're moved aside for the duration of this build.
import { cp, rm, mkdtemp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
// tsconfig's "include" is a blanket **/*.tsx, so renaming within the project
// (even to a private "_"-prefixed folder) still gets type-checked. Move these
// paths fully outside the project tree instead, for the duration of the build.
const stash = await mkdtemp(path.join(os.tmpdir(), "ibtattoo-pages-build-"));
const moves = [
  [path.join(root, "app", "admin"), path.join(stash, "app-admin")],
  [path.join(root, "app", "api"), path.join(stash, "app-api")],
  [path.join(root, "components", "admin"), path.join(stash, "components-admin")],
  [path.join(root, "middleware.ts"), path.join(stash, "middleware.ts")],
];

// Windows can throw EPERM on directory renames (e.g. an editor's file
// watcher holding a handle open), so move via copy+delete instead.
async function move(from, to) {
  await cp(from, to, { recursive: true });
  await rm(from, { recursive: true, force: true });
}

async function setAside() {
  for (const [from, to] of moves) {
    if (existsSync(from)) await move(from, to);
  }
}

async function restore() {
  for (const [from, to] of moves) {
    if (existsSync(to)) await move(to, from);
  }
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: true,
      cwd: root,
      env: { ...process.env, STATIC_EXPORT: "true" },
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`))));
  });
}

try {
  await setAside();
  await rm(path.join(root, "out"), { recursive: true, force: true });
  await run("npx", ["next", "build"]);
} finally {
  await restore();
}
