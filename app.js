require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const adminRoutes = require("./routers/admin");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", adminRoutes);

//connect to db
const database = process.env.DB_URI;
mongoose
  .connect(database)
  .then(() => {
    //listen Server dengan PORT
    app.listen(port, () => {
      console.log({ message: `Server running on port ${port} & DB connected` });
    });
  })
  .catch((error) => console.log(error));


