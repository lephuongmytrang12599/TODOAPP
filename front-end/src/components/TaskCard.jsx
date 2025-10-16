import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import api from "../lib/axios";
import { toast } from "sonner";

const TaskCard = ({ task, index, handleTaskChanged, updateTaskStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTaskTitle, setUpdatedTaskTitle] = useState(task.title || "");

  // 🗑️ Xóa nhiệm vụ
  const deletedTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Đã xóa nhiệm vụ thành công!");
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi xóa nhiệm vụ:", error);
      toast.error("Không thể xóa nhiệm vụ");
    }
  };

  // ✏️ Cập nhật tiêu đề nhiệm vụ
  const updateTask = async () => {
    if (!updatedTaskTitle.trim()) {
      toast.error("Tên nhiệm vụ không được để trống");
      return;
    }
    try {
      await api.put(`/tasks/${task._id}`, { title: updatedTaskTitle });
      toast.success(`Nhiệm vụ đã đổi thành "${updatedTaskTitle}"`);
      setIsEditing(false);
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật nhiệm vụ", error);
      toast.error("Không thể cập nhật nhiệm vụ");
    }
  };

  // ✅ Toggle hoàn thành / chưa hoàn thành
  const toggleTaskComplete = async () => {
    try {
      const newStatus = task.status === "completed" ? "active" : "completed";
      await api.put(`/tasks/${task._id}`, {
        status: newStatus,
        completedAt:
          newStatus === "completed" ? new Date().toISOString() : null,
      });

      toast.success(
        newStatus === "completed"
          ? "Đã đánh dấu hoàn thành"
          : "Đã chuyển về trạng thái hoạt động"
      );

      // ✅ Cập nhật local state (không refetch toàn bộ)
      updateTaskStatus(task._id, newStatus);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái nhiệm vụ", error);
      toast.error("Không thể thay đổi trạng thái");
    }
  };

  // ⌨️ Enter để lưu
  const handleKeyDown = (event) => {
    if (event.key === "Enter") updateTask();
  };

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "completed" && "opacity-75"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* ✅ Nút trạng thái */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTaskComplete}
          className={cn(
            "flex-shrink-0 size-8 rounded-full transition-200",
            task.status === "completed"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {task.status === "completed" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        {/* ✏️ Nội dung nhiệm vụ */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              placeholder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={updatedTaskTitle}
              onChange={(e) => setUpdatedTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsEditing(false)}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
          )}

          {/* 📅 Ngày tạo và hoàn thành */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ⚙️ Hành động */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditing(true);
              setUpdatedTaskTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deletedTask(task._id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
