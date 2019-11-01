const express = require("express");
const server = express();

const actionsRouter = require("./routers/actions-router");
const projectsRouter = require("./routers/projects-router");

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

// server.use("/api/actions", actionsRouter);
server.use("/api/projects", projectsRouter);

module.exports = server;