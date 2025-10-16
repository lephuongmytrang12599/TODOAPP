import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;
  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - now.getDay() === 0 ? 7 : 0;
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all": {
      startDate = null;
      break;
    }
  }
  const query = startDate ? { createdAt: { $gte: startDate } } : {};
  try {
    //const tasks = await Task.find().sort({ createdAt: -1 });
    // const activeCount = await Task.countDocuments({ status: "active" }); phương thức lọc dữ liệu mất thời gian

    //aggregate pipeline: Phương pháp băng chuyền tổng hợp trong mongoDB
    const results = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const tasks = results[0].tasks;
    const activeCount = results[0].activeCount[0]?.count || 0;
    const completedCount = results[0].completeCount[0]?.count || 0;

    res.status(200).json({
      tasks,
      activeCount,
      completedCount,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const createTasks = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Tiêu đề không được để trống" });
    }

    const task = new Task({ title });
    const newTask = await task.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTasks = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        completedAt,
      },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTasks = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }
    return res.status(200).json(deleteTasks);
  } catch (error) {
    console.error("Lỗi khi gọi deleteTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
