import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { createTask } from "../../api/tasksApi";
import type { Project } from "../../types/project";

type Props = {
  project: Project | null;
  onCreated: () => void;
};

export function TaskForm({ project, onCreated }: Props) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !name) return;

    setSubmitting(true);
    try {
      await createTask(name, project.id);
      setName("");
      onCreated();
    } catch (e) {
      console.error(e);
      alert("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={submit} className="mb-3">
      <InputGroup>
        <Form.Control
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={project ? "New task" : "Select a project first"}
          disabled={submitting || !project || project.status === "CLOSED"}
        />
        <Button
          type="submit"
          variant="success"
          disabled={!project || !name || submitting || project.status === "CLOSED"}
        >
          {submitting ? "Adding..." : "Ajouter"}
        </Button>
      </InputGroup>
    </Form>
  );
}