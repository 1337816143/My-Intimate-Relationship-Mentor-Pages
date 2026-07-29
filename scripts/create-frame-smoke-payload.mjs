import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

const password = "test-only-pages-password-2026-abcdef";
const iterations = 600000;
const aad = "mentor-pages-v1";
const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'">
<style>body{font-family:sans-serif}.ready{font-weight:700}</style>
</head>
<body>
<div id="app"></div>
<script>document.querySelector('#app').innerHTML='<main class="ready" data-smoke-ready>FRAME_READY</main>';</script>
</body>
</html>`;

const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(Buffer.from(password, "utf8"), salt, iterations, 32, "sha256");
const cipher = createCipheriv("aes-256-gcm", key, iv);
cipher.setAAD(Buffer.from(aad, "utf8"));
const encrypted = Buffer.concat([cipher.update(Buffer.from(html, "utf8")), cipher.final()]);
const combined = Buffer.concat([encrypted, cipher.getAuthTag()]);
const payload = {
  version: 1,
  algorithm: "AES-256-GCM",
  kdf: {
    name: "PBKDF2",
    hash: "SHA-256",
    iterations,
    salt: salt.toString("base64"),
  },
  iv: iv.toString("base64"),
  aad,
  ciphertext: combined.toString("base64"),
};

await mkdir("assets", { recursive: true });
await writeFile("assets/private-content.enc.json", `${JSON.stringify(payload)}\n`);
console.log("Browser smoke-test payload created.");
