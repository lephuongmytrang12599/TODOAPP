import express from "express";
import {
  createTasks,
  getAllTasks,
  updateTasks,
  deleteTasks,
} from "../controllers/tasksControllers.js";

const router = express.Router();

router.get("/", getAllTasks);
router.post("/", createTasks);
router.put("/:id", updateTasks);
router.delete("/:id", deleteTasks);

export default router;
