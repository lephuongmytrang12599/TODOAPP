import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createTask } from "../services/taskServices";
import api from "../lib/axios";
import { visibleTaskLimit } from "../lib/data";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(1);
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tasks?filter=${dateQuery}`);
      const data = response?.data || {};

      const list = Array.isArray(data.tasks)
        ? data.tasks
        : Array.isArray(data)
        ? data
        : [];

      const normalizedList = list.map((t) => {
        const s = (t.status || "").trim().toLowerCase();
        let normalizedStatus = "active";
        if (["complete", "completed", "done", "finished"].includes(s))
          normalizedStatus = "completed";
        else if (["active", "doing", "inprogress", "processing"].includes(s))
          normalizedStatus = "active";
        return { ...t, status: normalizedStatus };
      });

      setTasks(normalizedList);

      const active = normalizedList.filter((t) => t.status === "active").length;
      const completed = normalizedList.filter(
        (t) => t.status === "completed"
      ).length;

      setActiveCount(active);
      setCompletedCount(completed);
    } catch (error) {
      console.error("Lỗi khi tải tasks:", error);
      toast.error("Không thể tải danh sách công việc");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title) => {
    if (!title?.trim()) {
      toast.error("Bạn cần nhập nội dung nhiệm vụ");
      return null;
    }
    try {
      const newTask = await createTask({ title });
      setTasks((prev) => [newTask, ...prev]);
      setActiveCount((prev) => prev + 1);
      toast.success(`Nhiệm vụ "${title}" đã được thêm!`);
      return newTask;
    } catch (error) {
      console.error("Lỗi khi thêm task:", error);
      toast.error("Không thể thêm nhiệm vụ mới");
      return null;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  });

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);
  useEffect(() => {
    setPages(1);
  }, [filter, dateQuery]);

  const visibleTasks = filteredTasks.slice(
    (pages - 1) * visibleTaskLimit,
    pages * visibleTaskLimit
  );
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      const active = updatedTasks.filter((t) => t.status === "active").length;
      const completed = updatedTasks.filter(
        (t) => t.status === "completed"
      ).length;

      setActiveCount(active);
      setCompletedCount(completed);

      return updatedTasks;
    });
  };
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);
  const handleNext = () => {
    if (pages < totalPages) {
      setPages((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (pages > 1) {
      setPages((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPages(newPage);
  };
  return {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    dateQuery,
    visibleTasks,
    totalPages,
    setDateQuery,
    activeCount,
    completedCount,
    loading,
    refetch: fetchTasks,
    updateTaskStatus,
    addTask,
    pages,
    handleNext,
    handlePrev,
    handlePageChange,
  };
};

export default useTasks;
