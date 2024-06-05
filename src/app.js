import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(
    express.json({
        limit: "20kb",
    })
);
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);
app.use(express.static("public"));
app.use(cookieParser());

// import routes from routers
import healthcheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/User.routes.js"
import videoRouter from "./routes/Video.routes.js"
import commentRouter from "./routes/Comment.routes.js"
import likeRouter from "./routes/Like.routes.js"
import tweetRouter from "./routes/Tweet.routes.js"
import subscriptionRoute from "./routes/Subscription.routes.js"


// routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscription", subscriptionRoute)


export { app };
