import React from 'react';
import {author, repository, version} from "../package.json";

function About() {
    return (
        <>
            <h1>About Planning Poker {version}</h1>
            <p>Planning Poker is an opensource planning poker tool built on innovation day by {author.name}</p>
            <a href={repository.url}>{repository.url}</a>

            <h2>PeerJS</h2>
            <p>Planning Poker uses PeerJS for peer-to-peer communication, for setting up peer-to-peer connections PeerJS uses the PeerServer Cloud service.</p>
            <a href="https://peerjs.com/peerserver.html" target="_blank" rel="noreferrer noopener">Read more</a>
        </>
    );
}

export default About;