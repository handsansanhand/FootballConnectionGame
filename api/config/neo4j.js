/*Attempts to connect to the neo4j running docker container */
const neo4j = require('neo4j-driver');

// replace with your docker container’s credentials and port mapping
//TODO LATER
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

module.exports = driver;