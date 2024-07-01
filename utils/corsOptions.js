import dotenv from 'dotenv';
dotenv.config();
const allowList = JSON.parse(process.env.CLIENT_URL);

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