import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import adminRoutes from './routers/admin.js';
import publicRoutes from './routers/public.js';
import cors from 'cors';
import { corsOptions } from './utils/corsOptions.js';

const app = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", publicRoutes);
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


