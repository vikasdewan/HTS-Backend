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

  //routes import 
  //campus connect 
  import userRouter from './routes/campus-connect-routes/user.routes.js';
  import notificationRouter from './routes/campus-connect-routes/notification.routes.js';
  import discussionsRouter from './routes/campus-connect-routes/discussions.routes.js';
  import eventRouter from './routes/campus-connect-routes/event.routes.js';
  import friendRouter from './routes/campus-connect-routes/friend.routes.js';
  import messageConnectRouter from './routes/campus-connect-routes/message.routes.js';
  
  //campus store
  import productRouter from './routes/campus-store-routes/products.routes.js'
  import paymentRouter from './routes/campus-store-routes/payment.routes.js'
  import messageStoreRouter from './routes/campus-store-routes/message.routes.js'
  import favouriteRouter from './routes/campus-store-routes/favourite.routes.js'

  //campus eat
  import menuRouter from './routes/campus-eat-routes/menu.routes.js'
  import preorderRouter from './routes/campus-eat-routes/preorder.routes.js'
  import reviewRouter from './routes/campus-eat-routes/review.routes.js'

  //campus qna
  import answerRouter from './routes/campus-qna-routes/answer.routes.js'
  import questionRouter from './routes/campus-qna-routes/question.routes.js'
  import voteRouter from './routes/campus-qna-routes/vote.routes.js'


  //routes declaration
  //campus connect
  app.use("/api/v1/campus-connect/users",userRouter);
  app.use("/api/v1/campus-connect/notification",notificationRouter);
  app.use("/api/v1/campus-connect/discussion",discussionsRouter);
  app.use("/api/v1/campus-connect/event",eventRouter);
  app.use("/api/v1/campus-connect/friend",friendRouter);
  app.use("/api/v1/campus-connect/message",messageConnectRouter);

  //campus store
  app.use("/api/v1/campus-store/product",productRouter);
  app.use("/api/v1/campus-store/payment",paymentRouter);
  app.use("/api/v1/campus-store/message",messageStoreRouter);
  app.use("/api/v1/campus-store/favourite",favouriteRouter);

  //campus eat 
  app.use("/api/v1/campus-eat/menu",menuRouter);
  app.use("/api/v1/campus-eat/preorder",preorderRouter);
  app.use("/api/v1/campus-eat/review",reviewRouter);

  //campus qna
  app.use("/api/v1/campus-qna/question",questionRouter);
  app.use("/api/v1/campus-qna/answer",answerRouter);
  app.use("/api/v1/campus-qna/vote",voteRouter);
  export {app}; 