const http = require("http");
const fs = require("fs");
const path = require("path");

const types = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  mp4: "video/mp4",
};

const root = __dirname;

http.createServer((req, res) => {
  let f = req.url === "/" ? "/index.html" : req.url;
  f = path.join(root, f);
  try {
    if (!fs.existsSync(f)) {
      res.writeHead(404);
      res.end();
      return;
    }
    let ext = path.extname(f).slice(1);
    let s = fs.statSync(f);
    if (s.isDirectory()) {
      f = path.join(f, "index.html");
      ext = "html";
    }
    const mime = types[ext] || "application/octet-stream";
    if (ext === "mp4") {
      const stat = fs.statSync(f);
      res.writeHead(200, {
        "Content-Type": mime,
        "Content-Length": stat.size,
        "Accept-Ranges": "bytes"
      });
      const stream = fs.createReadStream(f);
      stream.pipe(res);
    } else {
      let c = fs.readFileSync(f);
      res.writeHead(200, { "Content-Type": mime });
      res.end(c);
    }
  } catch (e) {
    res.writeHead(500);
    res.end();
  }
}).listen(3000, "0.0.0.0", () => console.log("http://0.0.0.0:3000"));
