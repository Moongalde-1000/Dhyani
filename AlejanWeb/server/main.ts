// main.ts

import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from 'path';

import { mainRouter } from "./routes";
import rateLimit from "express-rate-limit";
import "./utils/firebase";

const EXPRESS_PORT = process.env.PORT || 3000;

const app = express();

//app.use('/goalimages', express.static(path.join(__dirname, 'uploads', 'goalimages')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());


app.use(cors());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://chat-app-react-ts-six.vercel.app",
//     ],
//   })
// );

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  // store: ... , // Redis, Memcached, etc. See below.
});
// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(mainRouter);

app.get("/ping", async (req, res) => {
  const ip1 = req.headers["x-real-ip"] || req.connection.remoteAddress;
  const ip2 =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  console.log("ip 1", ip1);
  console.log("ip 2", ip2);
  res.send("pong!");
});
app.listen(EXPRESS_PORT, () => {
  console.log(`🟢 App is running on port ${EXPRESS_PORT}.`);
});
