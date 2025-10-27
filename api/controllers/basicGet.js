const fetch = require("node-fetch");

async function basicGet(req, res) {
    const correctStr = "You have reached the basic get function successfully.";
    res.json(correctStr);
}

module.exports = { basicGet };