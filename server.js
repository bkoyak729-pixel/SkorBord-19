const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8000;
const API = "https://www.thesportsdb.com/api/v1/json/3";

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/live") {
    try {
      const sport = url.searchParams.get("sport") || "Soccer";

      const response = await fetch(
        `${API}/eventsnextleague.php?id=4328`
      );

      if (!response.ok) {
        throw new Error("API hatası: " + response.status);
      }

      const data = await response.json();

      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      });

      res.end(JSON.stringify({
        sport,
        events: data.events || [],
        source: "TheSportsDB",
        live: false
      }));
    } catch (error) {
      res.writeHead(500, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  const filePath = path.join(__dirname, "index.html");

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Sayfa bulunamadı");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });
    res.end(content);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`SkorBord-19 çalışıyor: ${PORT}`);
});
