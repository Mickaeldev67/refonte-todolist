import React from "react";
import type { Project } from "../../types/project";
import { ProjectForm } from "./ProjectForm";
import { ProjectItem } from "./ProjectItem";

type Props = {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onProjectsChanged: () => void;
};

export function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onProjectsChanged,
}: Props) {
  return (
    <div>
      <h3>Projects</h3>
      <ProjectForm onCreated={onProjectsChanged} />

      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          selected={project.id === selectedProjectId}
          onSelect={() => onSelectProject(project.id)}
          onChanged={onProjectsChanged}
        />
      ))}
    </div>
  );
}