import AddTask from "../components/AddTask";
import Header from "../components/Header";
import DateTimeFilter from "../components/DateTimeFilter";
import Footer from "../components/Footer";
import StasAndFilter from "../components/StasAndFilters";
import TaskList from "../components/TaskList";
import TaskListPagination from "../components/TaskListPagination";
import { useTasks } from "../hooks/useTasks";

const HomePage = () => {
  const {
    dateQuery,
    setDateQuery,
    visibleTasks,
    filter,
    setFilter,
    activeCount,
    completedCount,
    refetch,
    pages,
    totalPages,
    handlePrev,
    handleNext,
    updateTaskStatus,
  } = useTasks();

  const handleTaskChanged = () => {
    refetch();
  };

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Background effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
            radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)
          `,
        }}
      />

      <div className="container relative z-10 pt-8 mx-auto">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          <Header />
          <AddTask handleNewTaskAdded={handleTaskChanged} />

          <StasAndFilter
            filter={filter}
            setFilter={setFilter}
            activeTaskCount={activeCount}
            completedTaskCount={completedCount}
          />

          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
            updateTaskStatus={updateTaskStatus}
          />

          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handleTaskChanged={handleTaskChanged}
              page={pages}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>

          <Footer
            activeTaskCount={activeCount}
            completedTaskCount={completedCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
