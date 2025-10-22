import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Database connection
const connectionURL = process.env.MONGO_DB_CONNECTION_URL;

if (!connectionURL) {
  console.error("MONGO_DB_CONNECTION_URL is not defined in .env file");
  process.exit(1);
}

mongoose
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

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  due_date: String,
  priority: String,
  status: { type: String, default: "To Do" }, // Add status field for column categorization
});

const TaskModel = mongoose.model("Tasks", TaskSchema, "tasks");

export default TaskModel;
