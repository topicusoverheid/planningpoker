import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {Container, Navbar} from "react-bootstrap";
import Poker from "./Poker";
import Home from "./Home";
import PokerAdmin from "./PokerAdmin";
import Join from "./Join";
import About from "./About";

function App() {
    return (
        <BrowserRouter>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img
                                alt="Logo"
                                src="/icon.png"
                                width="30"
                                height="30"
                                className="d-inline-block align-top img-thumbnail rounded-circle"
                            /> Planning Poker
                        </Navbar.Brand>
                    </LinkContainer>
                </Container>
            </Navbar>
            <Container>
                <Route exact path="/" component={Home} />
                <Route exact path="/poker-admin/:id" component={PokerAdmin} />
                <Route exact path="/poker/:id" component={Poker} />
                <Route exact path="/join/:id" component={Join} />
                <Route exact path="/about" component={About} />
            </Container>
            <footer className="py-3 fixed-bottom bg-light">
                <Container>
                    <LinkContainer to="/about">
                        <span className="text-muted">Planning Poker © Topicus Overheid 2020</span>
                    </LinkContainer>
                </Container>
            </footer>
        </BrowserRouter>
    );
}

export default App;
