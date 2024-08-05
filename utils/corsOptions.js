import dotenv from 'dotenv';
dotenv.config();
let allowList = process.env.CLIENT_URL;
allowList = allowList.split(",");

export const corsOptions = {
  origin: (origin, callback) => {
    if (allowList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}