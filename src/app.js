import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import campusConnectRouter from "./routes/campus-connect.route.js";
import campusStoreRouter from "./routes/campus-store.route.js";
import campusEatRouter from "./routes/campus-eat.route.js";

const app = express();

app.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// campus connect routes
app.use("/api/v1/campus-connect", campusConnectRouter);

// campus store routes
app.use("/api/v1/campus-store", campusStoreRouter);

// campus eat routes
app.use("/api/v1/campus-eat", campusEatRouter);

export { app };
