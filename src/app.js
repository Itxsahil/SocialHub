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

import userRouter from "./routes/User.routes.js"
import videoRouter from "./routes/Video.routes.js"


// routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)

export { app };
