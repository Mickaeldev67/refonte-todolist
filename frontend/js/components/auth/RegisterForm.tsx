import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { register } from "../../api/authApi";

type Props = {
  onRegister: () => void;
};

export function RegisterForm({ onRegister }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await register(username, password);
      onRegister();
    } catch (e) {
      console.error(e);
      alert("Inscription échouée");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={submitRegister}>
      <Form.Control
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nom d'utilisateur"
        disabled={submitting}
        className="mb-2"
      />
      <Form.Control
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        disabled={submitting}
        className="mb-2"
      />
      <Button type="submit" disabled={submitting || !username || !password}>
        {submitting ? "En cours d'inscription..." : "Inscription réussie"}
      </Button>
    </Form>
  );
}