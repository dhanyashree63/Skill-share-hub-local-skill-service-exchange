// repo_scan.js
// Usage: node repo_scan.js  (run at repo root)
// Output: repo-scan-report.json

import fs from "fs";
import path from "path";

const root = process.cwd();
const exts = [".js", ".jsx", ".ts", ".tsx", ".json", ".env", ".html", ".css"];
const patterns = [
  "register(", "signup", "Register", "SignUp", "avatar", "file", "multipart",
  "poster.url", "poster", "posterUrl", "poster.url", "CourseCard", "course-card",
  "courses.map", "getAllCourses", "createCourse", "courseController", "CourseController",
  "cloudinary", "CLOUDINARY", "CLOUDINARY_APIKEY", "CLOUDINARY_APISECRET", "CLOUDINARY_NAME",
  "MONGO_URI", "config.env", "isFree", "price", "payment", "Razorpay", "pay", "checkout",
  "required", "type=\"file\"", "accept=\"image", "validator.isAlphanumeric", "isAlphanumeric",
  "<img", "poster.url", "playlist", "addToPlaylist", "myProfile", "login", "register", "resetPassword"
];

function walkDir(dir) {
  const res = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      // skip node_modules and .git for speed
      if (f.name === "node_modules" || f.name === ".git" || f.name === "dist" || f.name === "build") continue;
      res.push(...walkDir(full));
    } else {
      if (exts.includes(path.extname(f.name))) res.push(full);
    }
  }
  return res;
}

const files = walkDir(root);
const report = {};
for (const file of files) {
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch (e) { continue; }
  const lines = text.split(/\r?\n/);
  const matches = [];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    for (const p of patterns) {
      if (L.includes(p)) {
        matches.push({ line: i + 1, pattern: p, text: L.trim() });
      }
    }
  }
  if (matches.length) report[file.substring(root.length + 1)] = matches;
}

// Also list top-level config files we expect
const extras = ["backend/config/config.env", ".env", "config/config.env", "frontend/package.json", "backend/package.json"];
for (const e of extras) {
  if (fs.existsSync(path.join(root, e))) report[e] = report[e] || [{ note: "exists" }];
}

fs.writeFileSync(path.join(root, "repo-scan-report.json"), JSON.stringify(report, null, 2));
console.log("Scan complete. Wrote repo-scan-report.json");