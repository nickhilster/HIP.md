import { createServer } from "http";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = resolve(__dirname, "intake.html");

function getBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve(body.length ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

export async function serveBootstrap({ cwd, port = 3000, host = "127.0.0.1" }) {
  if (!existsSync(INDEX_PATH)) {
    throw new Error(`Could not find bootstrap intake page at ${INDEX_PATH}`);
  }

  const hipPath = resolve(cwd, "HIP.md");

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = readFileSync(INDEX_PATH, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    if (url.pathname === "/api/ping" && req.method === "GET") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (url.pathname === "/api/hip" && req.method === "POST") {
      try {
        const body = await getBody(req);
        if (!body || typeof body.content !== "string") {
          sendJson(res, 400, {
            ok: false,
            error: "Invalid payload. Expected JSON with content string.",
          });
          return;
        }

        writeFileSync(hipPath, body.content, "utf8");
        sendJson(res, 200, { ok: true, path: hipPath });
      } catch (error) {
        sendJson(res, 500, { ok: false, error: String(error) });
      }
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  });

  server.listen(port, host, () => {
    console.log(`HIP.md intake server is running at http://${host}:${port}`);
    console.log(
      "Open this URL in a browser to complete agent bootstrap intake.",
    );
  });

  return new Promise(() => {});
}
