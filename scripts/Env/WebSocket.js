const WebSocket = require("ws");
const { spawn } = require("child_process");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("Received message:", message);

    if (message === "execute-hardhat") {
      const command = spawn("cmd.exe", [
        "/c",
        "npx",
        "hardhat",
        "run",
        "scripts/EthInteractive.js",
        "--network",
        "sepolia",
      ]);

      command.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
        ws.send(`stdout: ${data.toString()}`);
        // transfer data to bnb network
      });

      command.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        ws.send(`stderr: ${data.toString()}`);
      });

      command.on("close", (code) => {
        console.log(`Command process exited with code ${code}`);
        ws.send(`Command process exited with code ${code}`);
        if (code !== 0) {
          ws.send("Process exited with error.");
        }
      });

      command.on("error", (err) => {
        console.error("Failed to start subprocess:", err);
        ws.send(`Failed to start subprocess: ${err.message}`);
      });
    }

    if (message === "execute-hardhat-bscTestnet") {
      const command = spawn("cmd.exe", [
        "/c",
        "npx",
        "hardhat",
        "run",
        "scripts/interact.js",
        "--network",
        "bscTestnet",
      ]);

      command.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
        ws.send(`stdout: ${data}`);
      });

      command.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        ws.send(`stderr: ${data.toString()}`);
      });

      command.on("close", (code) => {
        console.log(`Command process exited with code ${code}`);
        ws.send(`Command process exited with code ${code}`);
        if (code !== 0) {
          ws.send("Process exited with error.");
        }
      });

      command.on("error", (err) => {
        console.error("Failed to start subprocess:", err);
        ws.send(`Failed to start subprocess: ${err.message}`);
      });
    }
  });

  ws.on("close", function close() {
    console.log("WebSocket client disconnected");
  });
});
