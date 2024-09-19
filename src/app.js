import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    allowedHeaders: ["Content-Type"],
    origin:process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials:true
  }));


  app.use(express.json({limit:"16kb"}));
  app.use(express.urlencoded({extended:true,limit:"16kb"}));
  app.use(express.static("public"));
  app.use(cookieParser());

  
  export {app};