import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import { getProjects } from "../api/projectsApi";
import { getTasks } from "../api/tasksApi";
import { ProjectList } from "../components/projects/ProjectList";
import { TaskList } from "../components/tasks/TaskList";

export function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
    loadTasks();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);

      if (!selectedProjectId && data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function loadTasks() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      console.error(e);
    }
  }

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const filteredTasks = useMemo(
    () => tasks.filter((t) => t.projectId === selectedProjectId),
    [tasks, selectedProjectId]
  );

  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onProjectsChanged={loadProjects}
          />
        </Col>

        <Col md={8}>
          <TaskList
            project={selectedProject}
            tasks={filteredTasks}
            onTasksChanged={loadTasks}
          />
        </Col>
      </Row>
    </Container>
  );
}