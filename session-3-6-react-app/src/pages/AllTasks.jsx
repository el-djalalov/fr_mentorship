import { useTasks } from '../context/TaskContext';

function AllTasks() {
  const { getFilteredTasks } = useTasks();
  const tasks = getFilteredTasks();

  return (
    <div className="page">
      <h1>All Tasks</h1>
      <p>This page will show all tasks with filters (SESSION 4 demo)</p>
      <p>Total tasks: {tasks.length}</p>
    </div>
  );
}

export default AllTasks;
