import React, {useCallback, useEffect, useState} from 'react';
import {match, RouteComponentProps} from 'react-router';
import {Button, ButtonGroup, FormControl, InputGroup} from "react-bootstrap";
import {FaCopy, FaDesktop} from "react-icons/fa";
import {usePeerState} from "react-peer";
import Peer from "peerjs";
import User from "./User";
import State from "./State";
import StateView from "./StateView";

interface Props extends RouteComponentProps {
    match: match<{ id: string }>
}

function PokerAdmin({match, history, location}: Props) {
    const id = match.params.id;
    const [subject, setSubject] = useState('');
    const [selectedPoints, setSelectedPoints] = useState<number | undefined>(undefined);
    const [votes, setVotes] = useState<{ [peerId: string]: number | undefined }>({});
    const [stream, setStream] = useState<MediaStream | null>();

    const [state, setState, brokerId, connections, peer, error] = usePeerState<State>({
        subject: '',
        users: [],
        pokerPoints: localStorage.getItem('points') || 'Classic',
        sharingScreen: false
    }, {brokerId: id});

    useEffect(() => {
        if (error) {
            console.error('PeerJS error: ', error);
        }
    }, [error]);

    const setPartialState = useCallback((partialState: State | object) => {
        setState({...state, ...partialState});
    }, [state, setState]);

    const mapUsers = useCallback(() => {
        const users: User[] = connections.filter(conn => conn.open)
            .map(conn => ({peerId: conn.peer, name: conn.metadata.name, points: votes[conn.peer], voted: typeof votes[conn.peer] === 'number'}));
        users.push({peerId: id, name: localStorage.getItem('name') || 'Admin', points: selectedPoints, voted: typeof selectedPoints === 'number'})
        if (users.some(user => !user.voted)) {
            users.forEach(user => user.points = undefined);
        }
        return users;
    }, [connections, votes, selectedPoints, id]);

    const shareScreen = useCallback((conn: Peer.DataConnection, stream: MediaStream) => {
        const call = peer && peer.call(conn.peer, stream);
        if (call) {
            stream.getVideoTracks()[0].addEventListener('ended', function () {
                call.close();
            });
        }
    }, [peer]);

    const startScreenShare = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if ('getDisplayMedia' in navigator.mediaDevices) {
            // @ts-ignore
            navigator.mediaDevices.getDisplayMedia({}).then((stream: MediaStream) => {
                setStream(stream);
                stream.getVideoTracks()[0].addEventListener('ended', function () {
                    setStream(null);
                });
                connections.forEach(conn => {
                    if (conn.open) {
                        // @ts-ignore
                        shareScreen(conn, stream);
                    }
                });
            });
        } else {
            alert('Screen sharing is not supported.')
        }
    }, [stream, connections, shareScreen]);

    const updatePoints = useCallback((peerId: string, points: number | undefined) => {
        votes[peerId] = points;
        setVotes({...votes});
    }, [votes]);

    const updateSelectedPoints = useCallback((points: number | undefined) => {
        setSelectedPoints(points);
        updatePoints(id, points);
    }, [id, updatePoints]);

    const resetState = useCallback(() => {
        setSelectedPoints(undefined);
        setSubject('');
        setVotes({});
        setPartialState({subject: '', users: mapUsers()});
    }, [mapUsers, setPartialState]);

    useEffect(() => {
        setPartialState({sharingScreen: stream != null})
    }, [stream]);

    useEffect(() => {
        connections.forEach(conn => {
            if (!conn.metadata.initialized) {
                conn.open = true;
                conn.metadata.initialized = true;
                conn.on('open', function () {
                    if (stream) {
                        // @ts-ignore
                        shareScreen(conn, stream);
                    }
                });

                conn.on('data', data => {
                    if (data && 'points' in data) {
                        updatePoints(conn.peer, data.points);
                    }
                });
            }
        })
    }, [connections, stream, shareScreen, updatePoints]);

    useEffect(() => {
        setPartialState({users: mapUsers()});
    }, [mapUsers]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(value => value.stop());
            }
        }
    }, [stream]);

    useEffect(() => {
        return () => {
            if (peer) {
                peer.destroy();
            }
        }
    }, [peer]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Poker Admin</h1>
                <ButtonGroup>
                    {'getDisplayMedia' in navigator.mediaDevices &&
                        <Button onClick={startScreenShare}>
                            <FaDesktop /> Share screen
                        </Button>
                    }
                    <Button onClick={event => navigator.clipboard.writeText(window.location.origin + '/join/' + id)}>
                        <FaCopy /> Copy invite link
                    </Button>
                </ButtonGroup>
            </div>
            <InputGroup className="mb-3">
                <FormControl placeholder="Subject" aria-label="Subject" value={subject} onChange={event => {
                    setSubject(event.target.value);
                    setPartialState({subject: event.target.value});
                }} />
                <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={resetState}>Reset</Button>
                </InputGroup.Append>
            </InputGroup>
            <StateView peerId={id} state={state} onSelectPoints={updateSelectedPoints} />
        </>
    );
}

export default PokerAdmin;
