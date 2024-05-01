import { ConnectToDb } from "./db/index.js";
import 'dotenv/config'
// import dotenv from "dotenv"
// dotenv.config()
import { app } from "./app.js"


ConnectToDb()
    .then(app.listen(process.env.PORT || 8080, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    }))
    .catch((err) => {
        console.log("DB connection err", err)
    })