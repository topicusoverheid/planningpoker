import React, {useEffect, useState} from 'react';
import {match, RouteComponentProps} from 'react-router';
import {Badge, Button} from "react-bootstrap";
import {FaCopy} from "react-icons/fa";
import {useReceivePeerState} from "react-peer";
import State from "./State";
import StateView from "./StateView";
import {FullScreen, useFullScreenHandle} from "react-full-screen";

interface Props extends RouteComponentProps {
    match: match<{ id: string }>
}

function Poker({match}: Props) {
    const id = match.params.id;

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [state, isConnected, error, connection, peer] = useReceivePeerState<State>(id, {brokerId: ''}, {metadata: {name: localStorage.getItem('name')}});
    const fullScreenHandle = useFullScreenHandle();
    const [showStateView, setShowStateView] = useState(false);

    useEffect(() => {
        if (error) {
            console.error('PeerJS error: ', error);
        }
    }, [error]);

    useEffect(() => {
        peer?.on('call', function (call) {
            call.answer(new MediaStream());
            call.on('stream', (stream) => {
                setStream(stream);
            });
            call.on('close', setStream.bind(null, null));
        });
    }, [connection, peer]);

    var isUrl = false;
    try {
        if (state && state.subject) {
            new URL(state && state.subject);
            isUrl = true;
        }
    } catch (e) {
        isUrl = false;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Poker</h1>
                <Badge pill variant={isConnected && !error ? 'success' : 'danger'}>
                    {isConnected && !error ? 'Connected' : (error && error.toString()) || 'Connecting...'}
                </Badge>
                <Button onClick={event => navigator.clipboard.writeText(window.location.origin + '/join/' + id)}><FaCopy /> Copy invite link</Button>
            </div>
            {
                isUrl ?
                    <a href={state && state.subject} target="_blank" rel="noreferrer noopener">
                        <h2 className="text-truncate text-center">{state && state.subject}</h2>
                    </a>
                    :
                    <h2 className="text-truncate text-center">{(state && state.subject) || 'Waiting for subject...'}</h2>
            }
            <FullScreen handle={fullScreenHandle}>
                <div className="bg-white">
                    {stream && state && state.sharingScreen &&
                    <div className="d-flex justify-content-center">
                        <video style={{opacity: showStateView ? 0.05 : 1.0}}
                               onDoubleClick={fullScreenHandle.active ? fullScreenHandle.exit : fullScreenHandle.enter} muted autoPlay
                               width={fullScreenHandle.active ? '100%' : '100%'}
                               ref={instance => {
                                   if (instance && instance.srcObject !== stream) {
                                       instance.srcObject = stream;
                                   }
                               }}
                        />
                    </div>}
                    <div style={{opacity: showStateView ? 1.0 : 0.05}} className="container bg-white fixed-bottom mb-5"
                         onMouseEnter={setShowStateView.bind(null, true)} onMouseLeave={setShowStateView.bind(null, false)}>
                        <StateView peerId={(peer && peer.id) || ''}
                                   state={state || {subject: '', users: [], pokerPoints: 'Classic', sharingScreen: false}}
                                   onSelectPoints={points => connection && connection.send({points: points})} />
                    </div>
                </div>
            </FullScreen>
        </>
    );
}

export default Poker;
