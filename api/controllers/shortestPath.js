/* Controller responsible for finding the shortest route/path between two players
*/

async function getShortestPath(req, res) {
    const { player1 , player2 } = req.query;
    console.log(player1);
console.log(player2);
    res.json();
}

module.exports = { getShortestPath };