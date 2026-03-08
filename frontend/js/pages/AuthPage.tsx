import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

type Props = {
  onAuthenticated: () => void;
};

export function AuthPage({ onAuthenticated }: Props) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Container>
      <Row>
        <Col md={{ offset: 3, span: 6 }}>
          {showRegister ? (
            <RegisterForm onRegister={onAuthenticated} />
          ) : (
            <LoginForm onLogin={onAuthenticated} />
          )}

          <Button
            type="button"
            variant="link"
            onClick={() => setShowRegister((prev) => !prev)}
          >
            {showRegister ? "Vous possédez déjà un compte ? Connectez-vous" : "Pas de compte ? S'inscrire"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}