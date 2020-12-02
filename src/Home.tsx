import React, {useState} from 'react';
import {Button, Form, InputGroup, Jumbotron} from "react-bootstrap";
import PokerPoints from "./PokerPoints";
import {RouteComponentProps} from "react-router";
import {v4} from "uuid";

interface Props extends RouteComponentProps {
}

function Home({history}: Props) {
    const [name, setName] = useState(localStorage.getItem('name') || '');
    const [points, setPoints] = useState(localStorage.getItem('points') || 'Classic');
    const [sessionId, setSessionId] = useState(v4());

    return (
        <Jumbotron>
            <h1>Welcome to Planning Poker!</h1>
            <p>
                Planning Poker is built by Topicus Overheid on innovation day to facilitate remote planning poker.
            </p>
            <Form onSubmit={event => {
                event.preventDefault();
                localStorage.setItem('name', name);
                localStorage.setItem('points', points);
                history.push('/poker-admin/' + sessionId);
            }}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder="Name" aria-label="Name" required minLength={3} maxLength={255} isValid={name.length >= 3} value={name}
                                  onChange={event => {
                                      setName(event.target.value);
                                  }} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Points</Form.Label>
                    <Form.Control as="select" custom defaultValue={points} onChange={event => {
                        setPoints(event.target.value);
                    }}>
                        {Object.keys(PokerPoints).map(key => <option key={key} value={key}>{key} ({PokerPoints[key].join(', ')})</option>)}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Session ID</Form.Label>
                    <InputGroup>
                        <Form.Control placeholder="Session ID" aria-label="Session ID" required minLength={8} maxLength={255}
                                      isValid={sessionId.length >= 8} value={sessionId}
                                      onChange={event => {
                                          setSessionId(event.target.value);
                                      }} />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={event => setSessionId(v4())}>Generate</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
                <Button type="submit">Start</Button>
            </Form>
        </Jumbotron>
    );
}

export default Home;
