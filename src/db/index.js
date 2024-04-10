import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectToDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
        console.log(`The DB is connect.... !! on HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        throw error
        console.log(`Unable to connect with DB `)
    }
}

export { ConnectToDb }