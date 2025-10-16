import React from "react";

function Footer({ completedTaskCount = 0, activeTaskCount = 0 }) {
  const totalTasks = completedTaskCount + activeTaskCount;

  if (totalTasks === 0) return null; // Không hiển thị gì nếu không có nhiệm vụ

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">
        {completedTaskCount > 0 ? (
          <>
            <img
              src="/🎉.png"
              alt="celebration"
              className="inline w-4 h-4 mr-1"
            />
            Tuyệt vời! Bạn đã hoàn thành <b>{completedTaskCount}</b> việc
            {activeTaskCount > 0 && (
              <>
                {" "}
                — còn lại <b>{activeTaskCount}</b> việc nữa thôi. Cố lên!
              </>
            )}
          </>
        ) : (
          <>Hãy bắt đầu làm {activeTaskCount} nhiệm vụ nào!</>
        )}
      </p>
    </div>
  );
}

export default Footer;
