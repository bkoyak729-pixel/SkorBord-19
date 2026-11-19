const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/live") {
    try {
      const key = process.env.SPORTS_API_KEY;

      if (!key) {
        throw new Error("API anahtari eksik");
      }

      const response = await fetch(
        "https://v3.football.api-sports.io/fixtures?live=all",
        { headers: { "x-apisports-key": key } }
      );

      if (!response.ok) {
        throw new Error("API hatasi: " + response.status);
      }

      const data = await response.json();

      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(502, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (url.pathname === "/") {
    fs.readFile(
      path.join(__dirname, "index.html"),
      (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Dosya okunamadi");
          return;
        }

        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8"
        });
        res.end(data);
      }
    );
    return;
  }

  res.writeHead(404);
  res.end("Sayfa bulunamadi");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("SkorBord-19 sunucusu calisiyor");
});
