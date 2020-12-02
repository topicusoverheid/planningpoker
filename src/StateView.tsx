import React, {useEffect, useState} from 'react';
import State from "./State";
import {Pagination, ProgressBar} from "react-bootstrap";
import PokerPoints from "./PokerPoints";
import {FaUserTimes, FaUserCheck, FaHandshake} from "react-icons/fa";
import CountUp from 'react-countup';

interface Props {
    state: State,
    onSelectPoints: (points: number | undefined) => void,
    peerId: string
}

function StateView({peerId, state, onSelectPoints}: Props) {
    const [selectedPoints, setSelectedPoints] = useState<number | undefined>(undefined);

    function updateSelectedPoints(points: number) {
        if (points === selectedPoints) {
            setSelectedPoints(undefined);
            onSelectPoints(undefined);
        } else {
            setSelectedPoints(points);
            onSelectPoints(points)
        }
    }

    useEffect(() => {
        setSelectedPoints(undefined);
    }, [state.subject]);

    const totalUsers = state.users.length;
    const votedUsers = state.users.filter(user => user.voted).length;
    const allVoted = totalUsers === votedUsers;

    var total = 0;
    state.users.forEach(user => total += user.points || 0);
    const average = total / state.users.length;
    const allAgree = allVoted && new Set(state.users.map(user => user.points)).size === 1;

    return (
        <>
            <div className="d-flex justify-content-center">
                <Pagination size="lg">
                    {PokerPoints[state.pokerPoints].map(points =>
                        <Pagination.Item key={points} disabled={state.subject.length === 0} active={points === selectedPoints}
                                         onClick={updateSelectedPoints.bind(null, points)}>
                            {points}
                        </Pagination.Item>
                    )}
                </Pagination>
            </div>
            <ProgressBar now={(100 * votedUsers) / totalUsers} label={`${votedUsers}/${totalUsers}`}
                         variant={allVoted ? "primary" : "danger"}
                         className="mb-3" />
            <h2 className="d-flex justify-content-center">{(average && <CountUp end={Math.ceil(average)} />) || '???'}</h2>
            <h2 className="d-flex justify-content-center">
                <FaHandshake style={{opacity: allVoted ? 1 : 0}} className={allVoted && allAgree ? "text-success" : "text-danger"}/>
            </h2>
            <div className="d-flex justify-content-center">
                {state.users.map((user, index) =>
                    <div key={index} className="d-flex flex-column align-items-center img-thumbnail mx-1 px-3" title={user.name}>
                        <h6 className="text-muted">
                            {typeof user.points === "number" ? <CountUp end={user.points}/> : (user.voted ? '!!!' : '???')}
                        </h6>
                        <div>
                            {user.voted ?
                                <FaUserCheck className={user.voted ? 'text-primary' : 'text-danger'} size="64" />
                                :
                                <FaUserTimes className={user.voted ? 'text-primary' : 'text-danger'} size="64" />
                            }
                        </div>
                        <h5>{user.name}</h5>
                    </div>
                )}
            </div>
        </>
    );
}

export default StateView;