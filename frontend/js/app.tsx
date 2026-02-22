import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";

const API_BASE = "http://localhost:3000";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false); // ← toggle register/login

    useEffect(() => {
        fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
            .then(res => setIsAuthenticated(res.ok))
            .catch(() => setIsAuthenticated(false))
            .finally(() => setLoading(false));
    }, []);

    const logout = async () => {
        try {
            await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' });
        } catch (err) {
            console.error(err);
        } finally {
            setIsAuthenticated(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!isAuthenticated) {
        return (
            <Container>
                <Row>
                    <Col md={{ offset: 3, span: 6 }}>
                        {showRegister ? (
                            <RegisterForm onRegister={() => setIsAuthenticated(true)} />
                        ) : (
                            <LoginForm onLogin={() => setIsAuthenticated(true)} />
                        )}
                        <Button
                            variant="link"
                            onClick={() => setShowRegister(prev => !prev)}
                        >
                            {showRegister ? 'Already have an account? Login' : 'No account? Register'}
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <Button onClick={logout} className="mb-3">Logout</Button>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function RegisterForm({ onRegister }: { onRegister: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submitRegister = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });
            if (res.ok) onRegister();
            else alert('Registration failed');
        } catch (err) {
            console.error(err);
            alert('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={submitRegister}>
            <Form.Control
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                disabled={submitting}
            />
            <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                disabled={submitting}
            />
            <Button type="submit" disabled={submitting || !username || !password}>
                {submitting ? "Registering..." : "Register"}
            </Button>
        </Form>
    );
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submitLogin = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });
            if (res.ok) onLogin();
            else alert('Login failed');
        } catch (err) {
            console.error(err);
            alert('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={submitLogin}>
            <Form.Control
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                disabled={submitting}
            />
            <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                disabled={submitting}
            />
            <Button type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Login"}
            </Button>
        </Form>
    );
}

function TodoListCard() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch(`${API_BASE}/items`, { credentials: 'include' });
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error(err);
        }
    };

    const onNewItem = useCallback((newItem: any) => {
        setItems(prev => [...prev, newItem]);
    }, []);

    const onItemUpdate = useCallback((updatedItem: any) => {
        setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    }, []);

    const onItemRemoval = useCallback((removedItem: any) => {
        setItems(prev => prev.filter(i => i.id !== removedItem.id));
    }, []);

    return (
        <>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && <p className="text-center">No items yet! Add one above!</p>}
            {items.map(item => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </>
    );
}

function AddItemForm({ onNewItem }: { onNewItem: (item: any) => void }) {
    const [newItem, setNewItem] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submitNewItem = async (e: any) => {
        e.preventDefault();
        if (!newItem) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newItem }),
                credentials: 'include',
            });
            const item = await res.json();
            onNewItem(item);
            setNewItem('');
        } catch (err) {
            console.error(err);
            alert('Failed to add item');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    placeholder="New Item"
                    disabled={submitting}
                />
                <Button type="submit" variant="success" disabled={!newItem || submitting}>
                    {submitting ? "Adding..." : "Add Item"}
                </Button>
            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }: any) {
    const toggleCompletion = async () => {
        try {
            const res = await fetch(`${API_BASE}/items/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: item.name, completed: !item.completed }),
                credentials: 'include',
            });
            const updated = await res.json();
            onItemUpdate(updated);
        } catch (err) {
            console.error(err);
        }
    };

    const removeItem = async () => {
        try {
            await fetch(`${API_BASE}/items/${item.id}`, { method: 'DELETE', credentials: 'include' });
            onItemRemoval(item);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container fluid className={`item ${item.completed ? 'completed' : ''}`}>
            <Row>
                <Col xs={1} className="text-center">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={toggleCompletion}
                        aria-label={item.completed ? 'Mark item as incomplete' : 'Mark item as complete'}
                    >
                        <i className={`far ${item.completed ? 'fa-check-square' : 'fa-square'}`} />
                    </Button>
                </Col>
                <Col xs={10} className="name">{item.name}</Col>
                <Col xs={1} className="text-center remove">
                    <Button size="sm" variant="link" onClick={removeItem} aria-label="Remove Item">
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);