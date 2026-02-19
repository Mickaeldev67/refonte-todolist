"use strict";
function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (React.createElement(Container, null,
        React.createElement(Row, null,
            React.createElement(Col, { md: { offset: 3, span: 6 } },
                React.createElement(TodoListCard, null)))));
}
function TodoListCard() {
    const [items, setItems] = React.useState(null);
    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);
    const onNewItem = React.useCallback((newItem) => {
        setItems([...items, newItem]);
    }, [items]);
    const onItemUpdate = React.useCallback((item) => {
        const index = items.findIndex((i) => i.id === item.id);
        setItems([
            ...items.slice(0, index),
            item,
            ...items.slice(index + 1),
        ]);
    }, [items]);
    const onItemRemoval = React.useCallback((item) => {
        const index = items.findIndex((i) => i.id === item.id);
        setItems([...items.slice(0, index), ...items.slice(index + 1)]);
    }, [items]);
    if (items === null)
        return 'Loading...';
    return (React.createElement(React.Fragment, null,
        React.createElement(AddItemForm, { onNewItem: onNewItem }),
        items.length === 0 && (React.createElement("p", { className: "text-center" }, "No items yet! Add one above!")),
        items.map((item) => (React.createElement(ItemDisplay, { item: item, key: item.id, onItemUpdate: onItemUpdate, onItemRemoval: onItemRemoval })))));
}
function AddItemForm({ onNewItem }) {
    const { Form, InputGroup, Button } = ReactBootstrap;
    const [newItem, setNewItem] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const submitNewItem = (e) => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
            onNewItem(item);
            setSubmitting(false);
            setNewItem('');
        });
    };
    return (React.createElement(Form, { onSubmit: submitNewItem },
        React.createElement(InputGroup, { className: "mb-3" },
            React.createElement(Form.Control, { value: newItem, onChange: (e) => setNewItem(e.target.value), type: "text", placeholder: "New Item", "aria-describedby": "basic-addon1" }),
            React.createElement(InputGroup.Append, null,
                React.createElement(Button, { type: "submit", variant: "success", disabled: !newItem.length, className: submitting ? 'disabled' : '' }, submitting ? 'Adding...' : 'Add Item')))));
}
function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;
    const toggleCompletion = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };
    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() => onItemRemoval(item));
    };
    return (React.createElement(Container, { fluid: true, className: `item ${item.completed && 'completed'}` },
        React.createElement(Row, null,
            React.createElement(Col, { xs: 1, className: "text-center" },
                React.createElement(Button, { className: "toggles", size: "sm", variant: "link", onClick: toggleCompletion, "aria-label": item.completed
                        ? 'Mark item as incomplete'
                        : 'Mark item as complete' },
                    React.createElement("i", { className: `far ${item.completed ? 'fa-check-square' : 'fa-square'}` }))),
            React.createElement(Col, { xs: 10, className: "name" }, item.name),
            React.createElement(Col, { xs: 1, className: "text-center remove" },
                React.createElement(Button, { size: "sm", variant: "link", onClick: removeItem, "aria-label": "Remove Item" },
                    React.createElement("i", { className: "fa fa-trash text-danger" }))))));
}
ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
