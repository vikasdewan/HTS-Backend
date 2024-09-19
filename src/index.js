import connectDB from "./database/connection.db.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at port : http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection Failed ! ", err);
  });
