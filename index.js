const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const globalError = require("./middlwares/errorHandler");
const connDb = require("./config/db");
const WebSocket = require("ws");
const http = require("http");
const app = express();
// Set CSP headers to allow WebSocket connections
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' ws://localhost:5000 wss://localhost:5000; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  );
  next();
});
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "img-src 'self' https://img.freepik.com https://*.freepik.com data:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline';"
  );
  next();
});
dotenv.config();
const server = http.createServer(app);
//create webSocket server
const wss = new WebSocket.Server({ server });
const ApiError = require("./utils/AppError");
const {
  sendPrivateMessage,
  createNewGroup,
  joinGroup,
  sendGroupMessage,
} = require("./service/wsService");
//protect xss
app.use(xss());
// Basic security headers with Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Best practice: default-src should be the first directive
      scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.example.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://images.example.com"],
      connectSrc: ["'self'", "wss://localhost:5000"], // Allow WebSockets
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameAncestors: ["'none'"], // Prevent iframe embedding
      objectSrc: ["'none'"], // Disallow plugins
      upgradeInsecureRequests: [],
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
connDb();

let clients = [];
//wss server
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type == "connect") {
      clients.push({ username: data.username, ws });
      clients.forEach((client) => {
        client.ws.send(
          JSON.stringify({
            type: "online",
            users: clients.map((x) => x.username),
          })
        );
      });
      console.log(data);
    }
    if (data.to) {
      sendPrivateMessage(data, clients);
    }
    if (data.groupName) {
      createNewGroup(data, clients);
    }
    if (data.joinGroup) {
      joinGroup(data, clients);
    }
    if (data.toGroup) {
      sendGroupMessage(data, clients);
    }
  });
  console.log("user connected...");

  ws.on("close", () => {
    console.log(`${ws} disconnected...`);
    const userDisconnect = clients.find((client) => client.ws === ws);
    clients = clients.filter((client) => client.ws !== ws);
    clients.forEach((client) => {
      client.ws.send(
        JSON.stringify({
          type: "online",
          users: clients.map((x) => x.username),
        })
      );
    });
  });
  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
    ws.send(
      JSON.stringify({
        error: "An error occurred with the WebSocket connection",
      })
    );
  });
});
//routes
app.use("/api/user", require("./routes/user"));
app.use("/api/message", require("./routes/message"));
app.use("/api/group", require("./routes/groups"));
app.use("/api/group/members", require("./routes/groupMember"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "./client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is running...");
  });
}
app.use("*", (req, res, next) => {
  next(new ApiError("this route not found", 404));
});
app.use(globalError);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server running at port ${PORT}...`);
});
