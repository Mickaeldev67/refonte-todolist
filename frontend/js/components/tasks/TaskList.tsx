import React from "react";
import type { Task } from "../../types/task";
import type { Project } from "../../types/project";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";

type Props = {
  project: Project | null;
  tasks: Task[];
  onTasksChanged: () => void;
};

export function TaskList({ project, tasks, onTasksChanged }: Props) {
  if (!project) {
    return <p>Sélectionnez un projet pour voir ses tâches.</p>;
  }

  return (
    <div>
      <h3>Tasks for {project.name}</h3>

      <TaskForm project={project} onCreated={onTasksChanged} />

      {tasks.length === 0 && <p>Pas de tâches pour ce projet</p>}

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          projectClosed={project.status === "CLOSED"}
          onChanged={onTasksChanged}
        />
      ))}
    </div>
  );
}