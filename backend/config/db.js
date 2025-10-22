import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Database connection
const connectionURL = process.env.MONGO_DB_CONNECTION_URL;

if (!connectionURL) {
  console.error("MONGO_DB_CONNECTION_URL is not defined in .env file");
  process.exit(1);
}

const connectionToDb = async () => {
  try {
    await mongoose
      .connect(connectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Successfully connected to MongoDB Database");
      })
      .catch((err) => {
        console.error("Error connecting to Database:", err);
        process.exit(1);
      });
  } catch (err) {
    console.error("There was some unexpected error encounted!", err);
  }
};

export default connectionToDb;