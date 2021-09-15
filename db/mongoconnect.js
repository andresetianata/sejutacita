const {MongoClient} = require("mongodb");
require('dotenv').config();

var url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`;

async function run() {
  const client = await MongoClient.connect(url);
  const database = client.db(process.env.MONGO_DB_NAME);
  return { client, database }
}

module.exports = run();