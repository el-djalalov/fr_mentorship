import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks } = useTasks();

  const task = tasks.find(t => t.id === parseInt(id));

  if (!task) {
    return (
      <div className="page">
        <h1>Task Not Found</h1>
        <button onClick={() => navigate('/tasks')}>Back to Tasks</button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <button onClick={() => navigate('/tasks')}>Back</button>
    </div>
  );
}

export default TaskDetail;
