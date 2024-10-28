import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../features/tasksSlice";
import TaskForm from "./TaskForm";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Updated import
import "bootstrap/dist/css/bootstrap.min.css";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const closeForm = () => {
    setSelectedTask(null);
    setFormVisible(false);
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const taskId = filteredTasks[source.index].id;
    const newState = destination.droppableId;

    dispatch(updateTask({ id: taskId, state: newState }));
  };

  const groupedTasks = useMemo(() => {
    return ["todo", "doing", "done"].map(state => ({
      state,
      tasks: filteredTasks.filter(task => task.state === state)
    }));
  }, [filteredTasks]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        <div className="container">
          <div className="row d-flex justify-content-around mt-5">
            <button className="btn btn-primary w-25" onClick={() => setFormVisible(true)}>
              Add Task
            </button>
            {isFormVisible && <TaskForm existingTask={selectedTask} onClose={closeForm} />}
            <input
              type="text"
              placeholder="Search by task name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-50 form-control"
            />
          </div>
        </div>

        <div className="container-fluid m-4">
          <div className="row justify-content-around">
            {groupedTasks.map(({ state, tasks }) => (
              <Droppable key={state} droppableId={state}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="p-2 bg-light rounded border border-secondary"
                    style={{ maxWidth: "30%" }}
                  >
                    <h2 className="text-center">{state.charAt(0).toUpperCase() + state.slice(1)}</h2>
                    <ul className="list-unstyled">
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <li
                              className="card mb-3"
                              style={{ width: "100%", minHeight: "120px" }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <img
                                src={task.image}
                                alt={task.title}
                                className="img-fluid rounded-top"
                                style={{ height: "80px", objectFit: "cover" }}
                              />
                              <div className="card-body">
                                <h5 className="card-title">{task.title}</h5>
                                <p className="card-text">{task.description}</p>
                                <p className="card-text"><strong>Priority:</strong> {task.priority}</p>
                                <p className="card-text"><strong>State:</strong> {task.state}</p>
                                <button className="btn btn-primary me-2" onClick={() => handleEdit(task)}>
                                  Edit
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>
                                  Delete
                                </button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                    </ul>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default TaskList;
