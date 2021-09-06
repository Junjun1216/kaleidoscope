import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import "../../css/room/room.css";

import mute from "../../resources/mute.png";
import muteCam from "../../resources/no-camera.png";
import logout from "../../resources/logout.png";

const Room = (props) => {
    const [userData, setUserData] = useState({displayName: "guest"});
    const [fetchedData, setFetchedData] = useState(false);

    const [peers, setPeers] = useState([]);
    const [audioOnly, setAudioOnly] = useState(true);
    const socketRef = useRef();
    const userVideo = useRef({srcObject: null});
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;

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
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: {width: 720, height: 480} });
                setAudioOnly(false);
            } catch (err) {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                document.getElementsByClassName("room_btn")[1].style.filter = "invert(100%)";
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
    }, [fetchedData, roomID, userData.displayName]);

    useEffect(() => {
        let vid_collection = document.getElementsByClassName("vid_collection")[0];
        let views = document.getElementsByClassName("view_port_wrap");
        let self_displayName = document.getElementsByClassName("self")[0];

        if (audioOnly) {
            self_displayName.style.bottom = "50%";
            self_displayName.style.left = "30%";
            self_displayName.style.right = '30%';
            self_displayName.style.background = 'none';
            self_displayName.style.fontSize = '20px';
        } else {
            self_displayName.style = null;
        }

        if (peers.length > 0) {
            let vid_height = (vid_collection.clientHeight - 40) / 2;

            for (let x = 0; x < views.length; x++) {
                views[x].style.width = "auto";
                views[x].style.height = vid_height.toString() + "px";
            }

        } else {
            for (let x = 0; x < views.length; x++) {
                views[x].style.width = "720px";
                views[x].style.height = "480px";
            }
        }


    }, [peers, audioOnly])

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

    const mute_audio = () => {
        let button = document.getElementsByClassName("room_btn")[0];
        if (userVideo.current.srcObject.getAudioTracks()[0].enabled) {
            userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
            button.style.filter = "invert(100%)";
        } else {
            userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
            button.style.filter = null;
        }
    }

    const mute_video = () => {
        let self_displayName = document.getElementsByClassName("self")[0];
        let button = document.getElementsByClassName("room_btn")[1];

        if (userVideo.current.srcObject.getVideoTracks()[0]) {
            if (userVideo.current.srcObject.getVideoTracks()[0].enabled) {
                userVideo.current.srcObject.getVideoTracks()[0].enabled = false;

                self_displayName.style.bottom = "50%";
                self_displayName.style.left = "30%";
                self_displayName.style.right = '30%';
                self_displayName.style.background = 'none';
                self_displayName.style.fontSize = '20px';
                button.style.filter = "invert(100%)";
            } else {
                userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
                self_displayName.style = null;
                button.style.filter = null;
            }
        }
    }

    const disconnect = () => {
        socketRef.current.emit("end call");
        socketRef.current.off();
        for (let index = 0; index < peersRef.current.length; index++) {
            peersRef.current[index].peer.destroy();
        }

        document.getElementsByClassName("room")[0].style.filter = "blur(1.1rem)";
        document.getElementsByClassName("call_ended")[0].style.display = "block";

        let button = document.getElementsByClassName("room_btn")[2];
        button.style.filter = "invert(100%)";
    }

    const Video = ({ peer, index }) => {
        const ref = useRef();

        useEffect(() => {
            peer.on("stream", stream => {
                ref.current.srcObject = stream;
            })
        }, [peer]);

        return (
            <div className="view_port_wrap">
                <video className="vid_viewport" playsInline autoPlay ref={ref} />
                <span className="display_name">{peersRef.current[index].displayName}</span>
            </div>
        );
    }

    return (
        <div className="room_wrap">
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
                            <div className="display_name self">{userData.displayName}</div>
                        </div>
                    </div>
                    <div className="menu_board">
                        <div className="room_btn" onClick={mute_audio}>
                            <img className="icons" src={mute} alt="mute"/>
                        </div>
                        <div className="room_btn" onClick={mute_video}>
                            <img className="icons" src={muteCam} alt="muteCam"/>
                        </div>
                        <div className="room_btn" onClick={disconnect}>
                            <img className="icons icon_margin" src={logout} alt="logout"/>
                        </div>
                    </div>
                </div>
                <div className="side_bar">

                </div>
            </div>
            <div className="call_ended">
                Call Ended
            </div>
        </div>
    );
};

export default Room;
