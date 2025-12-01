const { PORT } = require("./config");
const express = require("express");
const cors = require("cors");
const shortestPath = require("./routes/shortestPath");
const players = require("./routes/players");
const findPath = require("./routes/findPath");
const app = express();

const rateLimit = require('express-rate-limit');

// Global rate limiter (affects ALL routes)
const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 60,              // 60 requests per minute per IP
  message: {
    status: 429,
    error: "Too many requests. Please slow down."
  }
});

app.use(limiter);

//TODO: CHANGE CORS TO SOMETHING LIKE:
/*app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
  methods: ["GET", "POST"],
}));
AND PUT THE ORIGIN AS THE AWS FRONTEND LOCATION ?
*/
app.use(cors({
  origin: [
    "http://localhost",         // frontend served by docker/nginx
    "http://127.0.0.1",         // sometimes used by the browser
    "http://localhost:3000",    // dev mode outside docker
    "https://your-frontend-domain.com"  // prod site TODO
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/shortestPath", shortestPath);
app.use("/players", players);
app.use("/findPath", findPath);

app.listen(PORT || 3030, () => {
  console.log("App is listening on port ", PORT || 3030);
}).on('error', err => {
  console.error("Server failed to start: ", err);
});