const { PORT } = require("./config");
const express = require("express");
const cors = require("cors");
const shortestPath = require("./routes/shortestPath");
const players = require("./routes/players");
const app = express();

//TODO: CHANGE CORS TO SOMETHING LIKE:
/*app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
AND PUT THE ORIGIN AS THE AWS FRONTEND LOCATION ?
*/
app.use(cors());

app.use("/shortestPath", shortestPath);
app.use("/players", players);

app.listen(PORT || 3030, () => {
  console.log("App is listening on port ", PORT || 3030);
}).on('error', err => {
  console.error("Server failed to start: ", err);
});