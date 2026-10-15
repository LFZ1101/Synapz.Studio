import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = "/opt/cursor/artifacts/screenshots";
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync("/opt/cursor/artifacts", { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: "/tmp/plataforma-video", size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
const errors = [];

page.on("pageerror", (err) => errors.push(String(err)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

async function shot(name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("screenshot", file);
}

await page.goto("http://localhost:3000/plataforma/entrar", { waitUntil: "networkidle" });
await shot("plataforma-login.png");

await page.fill('input[name="email"]', "dono@synapz.studio");
await page.fill('input[name="password"]', "senha-segura-123");
await Promise.all([
  page.waitForURL("**/plataforma", { timeout: 15000 }),
  page.click('button[type="submit"]'),
]);
await page.waitForTimeout(800);
await shot("plataforma-dashboard.png");

const body = await page.locator("body").innerText();
console.log("dashboardHasLucro", body.includes("Lucro"));
console.log("dashboardHasMoney", /R\$\s?8\.500|8\.500,00/.test(body));

await page.goto("http://localhost:3000/plataforma/clientes", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await shot("plataforma-clientes.png");
const clientsText = await page.locator("body").innerText();
console.log("hasAegis", clientsText.includes("Aegis"));

await page.goto("http://localhost:3000/plataforma/crm", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await shot("plataforma-crm.png");
const crmText = await page.locator("body").innerText();
console.log("hasOpp", crmText.includes("Portal institucional"));

await page.goto("http://localhost:3000/plataforma/vendas", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await shot("plataforma-vendas.png");

await page.goto("http://localhost:3000/plataforma/fluxo", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await shot("plataforma-fluxo.png");

console.log("pageErrors", errors.slice(0, 10));

const videoPath = await page.video()?.path();
await context.close();
await browser.close();

if (videoPath && fs.existsSync(videoPath)) {
  const dest = "/opt/cursor/artifacts/plataforma-smoke.webm";
  fs.copyFileSync(videoPath, dest);
  console.log("video", dest);
}
console.log("DONE");
