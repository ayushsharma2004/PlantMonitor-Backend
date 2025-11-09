import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";

import plantRoutes from "./routes/plantsRoute.js";
import cookieParser from "cookie-parser";

import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

//configure env
dotenv.config();

//express object
const app = express();

//middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://sn-music-student-frontend.vercel.app",
  "https://plant-monitor-frontend-livid.vercel.app",
  "https://sn-music-student-frontend-git-e441d8-ayushsharma2004s-projects.vercel.app", // removed trailing slash
  "https://sn-music-admin-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  // Add these before your CORS middleware
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.use(morgan('combined'));
app.use(cookieParser());
// Custom middleware to log request duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

//routes
app.use("/api/v1/plants", plantRoutes);

//rest api
app.get("/", (req, res) => {
  try {
    res.send("<h1>Welcome to SNMUSIC</h1>");
  } catch (error) {
    console.log(error);
  }
});

//PORT
const PORT = process.env.PORT || 8080;

//Listens
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.cyan);
});
