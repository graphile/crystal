import { createServer } from "http";
import { graphileInspectHTML } from "./server";

const server = createServer((req, res) => {
  if (req.url !== "/") {
    res.writeHead(308, undefined, { Location: "/" });
    res.end();
    return;
  }
  res.writeHead(200, undefined, {
    "Content-Type": "text/html; charset=utf-8",
  });
  res.end(graphileInspectHTML({}));
});

server.listen(1337, () => {
  console.log("Server listening at http://localhost:1337");
});
