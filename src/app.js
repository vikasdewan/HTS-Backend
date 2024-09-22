import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

//campus connect
const campusConnectRouter = import("./routes/campus-connect.route.js");
app.use("/api/v1/campus-connect", campusConnectRouter);

//campus store
const campusStoreRouter = import("./routes/campus-store.route.js");
app.use("/api/v1/campus-store", campusStoreRouter);

//campus eat
const campusEatRouter = import("./routes/campus-eat.route.js");
app.use("/api/v1/campus-eat", campusEatRouter);



export { app };
