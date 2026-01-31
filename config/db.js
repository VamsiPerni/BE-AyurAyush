const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB_URL, {
    dbName: "ayurayush",
  })
  .then(() => {
    console.log("🟢--------DB CONNECTED---------");
  })
  .catch((err) => {
    console.log("🔴-----DB Connection Error------");
    console.log(err.message);
    console.log("--------------------------------");
  });
