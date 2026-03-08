import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { login } from "../../api/authApi";

type Props = {
  onLogin: () => void;
};

export function LoginForm({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(username, password);
      onLogin();
    } catch (e) {
      console.error(e);
      alert("Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={submitLogin}>
      <Form.Control
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        disabled={submitting}
        className="mb-2"
      />
      <Form.Control
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={submitting}
        className="mb-2"
      />
      <Button type="submit" disabled={submitting || !username || !password}>
        {submitting ? "Logging in..." : "Login"}
      </Button>
    </Form>
  );
}