import React from "react";
import { Button, Card } from "react-bootstrap";
import type { Project } from "../../types/project";
import { closeProject, deleteProject } from "../../api/projectsApi";

type Props = {
  project: Project;
  selected: boolean;
  onSelect: () => void;
  onChanged: () => void;
};

export function ProjectItem({ project, selected, onSelect, onChanged }: Props) {
  const handleClose = async () => {
    try {
      await closeProject(project.id);
      onChanged();
    } catch (e) {
      console.error(e);
      alert("La fermeture du projet a échoué");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      onChanged();
    } catch (e) {
      console.error(e);
      alert("La suppression du projet a échouée");
    }
  };

  return (
    <Card className={`mb-2 ${selected ? "border-primary" : ""}`}>
      <Card.Body>
        <div onClick={onSelect} style={{ cursor: "pointer" }}>
          <Card.Title>{project.name}</Card.Title>
          <Card.Text>{project.description || "No description"}</Card.Text>
          <Card.Text>
            Status: {project.status} | Ouvert: {project.openTasksCount} | Fermé: {project.closedTasksCount}
          </Card.Text>
        </div>

        <Button
          size="sm"
          variant="warning"
          className="me-2"
          onClick={handleClose}
          disabled={project.status === "CLOSED"}
        >
          Fermes
        </Button>

        <Button size="sm" variant="danger" onClick={handleDelete}>
          Supprimer
        </Button>
      </Card.Body>
    </Card>
  );
}