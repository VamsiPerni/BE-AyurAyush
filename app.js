const dotenv = require("dotenv");
dotenv.config();

if (process.env.NODE_ENV != "production") {
  const dns = require("dns");
  dns.setServers([process.env.DNS_SERVER, process.env.DNS_ALTERNATE_SERVER]);
}

require("./config/db.js");

const express = require("express");

const app = express();

app.listen(process.env.PORT, () => {
  console.log("-------- Server started --------");
});
