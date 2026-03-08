import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { createProject } from "../../api/projectsApi";

type Props = {
  onCreated: () => void;
};

export function ProjectForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createProject(name, description);
      setName("");
      setDescription("");
      onCreated();
    } catch (e) {
      console.error(e);
      alert("Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={submit} className="mb-3">
      <Form.Control
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du projet"
        className="mb-2"
      />
      <Form.Control
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="mb-2"
      />
      <Button type="submit" disabled={submitting || !name}>
        {submitting ? "Création en cours..." : "Créer le projet"}
      </Button>
    </Form>
  );
}