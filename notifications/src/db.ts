import mongoose, { ConnectionOptions, connect } from "mongoose";
import config from "config";

const dbConfig: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
};
const connectDB: any = async () => {
    try {
        await connect(
            config.get("mongoURI"),
            dbConfig
        );
        console.log(`DB notifications is connected 🌀 `);
    } catch (error) {
        console.error(error.message);
        //NOTE exit process if something is wrong
        process.exit(1);
    }
};
export default connectDB;
