import React, {useState} from 'react';
import {match, RouteComponentProps} from 'react-router';
import {Button, Form} from "react-bootstrap";

interface Props extends RouteComponentProps {
    match: match<{ id: string }>
}

function Join({match, history}: Props) {
    const id = match.params.id;
    const [name, setName] = useState(localStorage.getItem('name') || '');

    return (
        <>
            <h1>Join {id}</h1>
            <Form onSubmit={event => {
                event.preventDefault();
                localStorage.setItem('name', name);
                history.push('/poker/' + id);
            }}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder="Name" aria-label="Name" minLength={3} maxLength={255} isValid={name.length >= 3} value={name} onChange={event => setName(event.target.value)} />
                </Form.Group>
                <Button type="submit">Start</Button>
            </Form>
        </>
    );
}

export default Join;
