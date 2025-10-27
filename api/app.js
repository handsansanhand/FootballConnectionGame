const { PORT } = require("./config");
const express = require("express");
const cors = require("cors");
const basicAPIRoutes = require("./routes/basicAPI");
const shortestPath = require("./routes/shortestPath");
const app = express();

app.use("/", basicAPIRoutes);
app.use("/shortestPath", shortestPath);

app.listen(PORT || 3000, () => {
  console.log("App is listening on port ", PORT || 3000);
}).on('error', err => {
  console.error("Server failed to start: ", err);
});