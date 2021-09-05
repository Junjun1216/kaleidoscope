import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import "../../css/room/room.css";

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const [audioOnly, setAudioOnly] = useState(true);
    const [userData, setUserData] = useState({displayName: "guest"});
    const [fetchedData, setFetchedData] = useState(false);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    const videoConstraints = {
        width: 720,
        height: 480
    };

    useEffect(() => {
        const fetchData = async () => {
            const url = "/api/getUserData";
            const options = {
                headers : {
                    'Accept': 'application/json'
                },
                credentials: "include"
            };

            fetch(url, options).then(res => {
                if (res.status === 200) {
                    return res.json()
                }
                setFetchedData(true);
            }).then(data => {
                setUserData(data);
                setFetchedData(true);
            }).catch(err => {
                console.log(err)
            })
        }

        fetchData();
    }, []);

    useEffect(() => {
        const connect = async () => {
            socketRef.current = io.connect("/", {"sync disconnect on unload": true});

            let stream = null;

            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: videoConstraints })
                await setAudioOnly(false);
            } catch (err) {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            }

            userVideo.current.srcObject = stream;

            socketRef.current.emit("join room", {roomID: roomID, displayName: userData.displayName});

            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(user => {
                    const peer = createPeer(user.id, socketRef.current.id, stream, userData.displayName);
                    peersRef.current.push({
                        peerID: user.id,
                        displayName: user.displayName,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("update users", users => {
                const peers = [];
                users.forEach(user => {
                    if (user.id !== socketRef.current.id) {
                        const peer = createPeer(user.id, socketRef.current.id, stream, userData.displayName);
                        peersRef.current.push({
                            peerID: user.id,
                            displayName: user.displayName,
                            peer,
                        })
                        peers.push(peer);
                    }
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream, userData.displayName);
                peersRef.current.push({
                    peerID: payload.callerID,
                    displayName: payload.displayName,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        }

        if (fetchedData) {
            connect();
        }
    }, [fetchedData]);

    useEffect(() => {
        let views = document.getElementsByClassName("view_port_wrap");
        for (let x = 0; x < views.length; x++) {
            if (peers.length > 0) {
                views[x].style.width = "40%";
                views[x].style.height = "44%";
            } else {
                views[x].style.width = "55%";
                views[x].style.height = "80%";
            }
        }
    }, [peers])

    const createPeer = (userToSignal, callerID, stream, callerDisplayName) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, callerDisplayName })
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    const Video = ({ peer, index }) => {
        const ref = useRef();

        useEffect(() => {
            peer.on("stream", stream => {
                ref.current.srcObject = stream;
            })
        }, []);

        return (
            <div className="view_port_wrap">
                <video className="vid_viewport" playsInline autoPlay ref={ref} />
                <div className="display_name_wrap">
                    <span className="display_name">{peersRef.current[index].displayName}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="room">
            <div className="main_viewport">
                <div className="vid_collection">
                    {peers.map((peer, index) => {
                        return (
                            <Video key={index} peer={peer} index={index}/>
                        );
                    })}
                    <div className="view_port_wrap">
                        <video className="vid_viewport" ref={userVideo} muted autoPlay playsInline/>
                        <div className="display_name_wrap">
                            <span className="display_name">{userData.displayName}</span>
                        </div>
                    </div>
                </div>
                <div className="control_panel">

                </div>
            </div>
            <div className="side_bar">

            </div>
        </div>
    );
};

export default Room;
