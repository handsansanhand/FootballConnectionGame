const { PORT } = require("./config");
const express = require("express");
const cors = require("cors");
const shortestPath = require("./routes/shortestPath");
const players = require("./routes/players");
const app = express();

app.use("/shortestPath", shortestPath);
app.use("/players", players);

app.listen(PORT || 3030, () => {
  console.log("App is listening on port ", PORT || 3030);
}).on('error', err => {
  console.error("Server failed to start: ", err);
});