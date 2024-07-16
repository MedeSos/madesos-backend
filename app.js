import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

import { corsOptions } from './utils/corsOptions.js';
import V1 from './routers/v1/index.js';

const __dirname = path.resolve();

const app = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets",express.static(path.join(__dirname, "public/uploads")));
app.use('/v1', V1);

//Route Not Found
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    statusCode: 404,
    message: "Page Not Found",
  })
});
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


