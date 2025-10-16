import express from "express";
import tasksRoutes from "./routes/tasksRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
//middlewares
app.use(cors());
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());
app.use("/api/tasks", tasksRoutes);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
});
