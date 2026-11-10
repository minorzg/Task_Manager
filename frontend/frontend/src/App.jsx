import { useState, useEffect } from "react";
import API from "./services/api";

function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await API.get("/tasks");
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await API.post("/tasks", {
            title,
            description,
            completed: false
        });

        setTitle("");
        setDescription("");

        const response = await API.get("/tasks");
        setTasks(response.data);

    } catch (error) {
        console.error("Error creating task:", error);
    }
};

const handleComplete = async (id) => {
    try {
        await API.patch(`/tasks/${id}`);

        const response = await API.get("/tasks");
        setTasks(response.data);

    } catch (error) {
        console.error("Error completing task:", error);
    }
};

const handleDelete = async (id) => {
    try {
        await API.delete(`/tasks/${id}`);

        const response = await API.get("/tasks");
        setTasks(response.data);

    } catch (error) {
        console.error("Error deleting task:", error);
    }
};

  return (
    <div>
            <h1>My Task Manager</h1>

            {tasks.map((task) => (
                <div key={task._id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>
                        Status: {task.completed ? "Completed" : "Pending"}
                    </p>
                    <button
                    onClick={() => handleComplete(task._id)}
                    disabled={task.completed}
                    >
                    {task.completed ? "Completed" : "Mark as completed"}
                    </button>

                    <button onClick={() => handleDelete(task._id)}>
                    Delete
                    </button>

                </div>
                
            ))}
            <form onSubmit={handleSubmit}>
        <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

        <button type="submit">Add Task</button>
        </form>
      

      </div>
      
   
  );
}

export default App;