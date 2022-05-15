const { MongoClient } = require("mongodb");

require("dotenv").config();
const uri = process.env.MONGO_URL;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true });
module.exports.client = client;
module.exports.main = async function main() {
  try {
    const res = await client.connect();
    console.log("connected to the database");
  } catch (err) {
    console.log(err);
  }
};

// main();
