const WebSocket = require("ws");
const { spawn } = require("child_process");
const express = require("express");
const wss = new WebSocket.Server({ port: 8080 });

const app = express();
const PORT = 3000;

app.get("/event", async (req, res) => {
  let outputData = "";
  const command = spawn("cmd.exe", [
    "/c",
    "npx",
    "hardhat",
    "run",
    "scripts/EthInteractive.js",
    "--network",
    "bscTestnet",
  ]);

  command.stdout.on("data", async (data) => {
    console.log(`stdout: ${data}`);
    outputData += data.toString();
  });

  command.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    res.send(data.toString());
  });

  command.on("close", (code) => {
    console.log(`Command process exited with code ${code}`);

    if (code !== 0) {
      res.send("Process exited with error.");
    }
    res.send(`Command output: ${outputData}`);
  });

  command.on("error", (err) => {
    console.error("Failed to start subprocess:", err);
    res.send(`Failed to start subprocess: ${err.message}`);
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
