import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import "../../css/room/room.css";

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const [audioOnly, setAudioOnly] = useState(true);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    const videoConstraints = {
        width: 720,
        height: 480
    };

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

            console.log(socketRef);

            userVideo.current.srcObject = stream;

            socketRef.current.emit("join room", roomID);

            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        }

        connect();
    }, [roomID]);

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

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
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

    const Video = (props) => {
        const ref = useRef();

        useEffect(() => {
            props.peer.on("stream", stream => {
                ref.current.srcObject = stream;
            })
        }, []);

        return (
            <div className="view_port_wrap">
                <video className="vid_viewport" playsInline autoPlay ref={ref} />
                <div className="display_name_wrap">
                    <span className="display_name">Guest</span>
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
                            <Video key={index} peer={peer}>Guest</Video>
                        );
                    })}
                    <div className="view_port_wrap">
                        <video className="vid_viewport" ref={userVideo} muted autoPlay playsInline/>
                        <div className="display_name_wrap">
                            <span className="display_name">Guest</span>
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
