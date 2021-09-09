import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import "../../css/room/room.css";

import muteIcon from "../../resources/mute.png";
import muteCamIcon from "../../resources/no-camera.png";
import logoutIcon from "../../resources/logout.png";

const Room = (props) => {
    const [userData, setUserData] = useState({displayName: "guest"});
    const [videoOn, setVideoOn] = useState(false);
    const [mute, setMute] = useState(false);
    const [fetchedData, setFetchedData] = useState(false);

    const [peers, setPeers] = useState([]);
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
            let video = false;

            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: {width: 720, height: 480} });
                setVideoOn(true);
                video = true;
            } catch (err) {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                document.getElementsByClassName("room_btn")[1].style.filter = "invert(100%)";
            }

            userVideo.current.srcObject = stream;

            let self_displayName = document.getElementsByClassName("self")[0];
            let self_mute = document.getElementsByClassName("self_mute")[0];

            if (!video) {
                self_displayName.style.bottom = "50%";
                self_displayName.style.left = "30%";
                self_displayName.style.right = '30%';
                self_displayName.style.background = 'none';
                self_displayName.style.fontSize = '20px';
                self_mute.style.height = "18px";
            } else {
                self_displayName.style = null;
                self_mute.style.height = null;
            }

            socketRef.current.emit("join room", {roomID: roomID, displayName: userData.displayName, userStatus: {videoOn: video, mute: mute}});

            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(user => {
                    const peer = createPeer(user.id, socketRef.current.id, stream, userData.displayName, {videoOn: video, mute: mute});
                    peersRef.current.push({
                        peerID: user.id,
                        displayName: user.displayName,
                        userStatus: user.userStatus,
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
                            userStatus: user.userStatus,
                            peer,
                        })
                        peers.push(peer);
                    }
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    displayName: payload.displayName,
                    userStatus: payload.userStatus,
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

        if (peers.length > 0) {
            let vidHeight = (vid_collection.clientHeight - 40) / 2;
            let vidWidth = (vidHeight*1.5);

            for (let x = 0; x < views.length; x++) {
                views[x].style.height = vidHeight.toString() + "px";
                views[x].style.width = vidWidth.toString() + "px";
            }
        } else {
            for (let x = 0; x < views.length; x++) {
                views[x].style.width = "720px";
                views[x].style.height = "480px";
            }
        }

    }, [peers, videoOn])

    const createPeer = (userToSignal, callerID, stream, callerDisplayName, callerStatus) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, callerDisplayName, callerStatus })
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
        let self_mute = document.getElementsByClassName("self_mute")[0];

        if (userVideo.current.srcObject !== null) {
            if (userVideo.current.srcObject.getAudioTracks()[0].enabled) {
                userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
                button.style.filter = "invert(100%)";
                self_mute.style.display = "block";
                setMute(false);
                socketRef.current.emit("update user status", {videoOn: videoOn, mute: false});
            } else {
                userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
                button.style.filter = null;
                self_mute.style.display = "none";
                setMute(true);
                socketRef.current.emit("update user status", {videoOn: videoOn, mute: true});
            }
        }
    }

    const mute_video = () => {
        let self_displayName = document.getElementsByClassName("self")[0];
        let mute_button = document.getElementsByClassName("room_btn")[1];
        let self_mute_icon = document.getElementsByClassName("self_mute")[0];

        if (userVideo.current.srcObject !== null) {
            if (userVideo.current.srcObject.getVideoTracks()[0]) {
                if (userVideo.current.srcObject.getVideoTracks()[0].enabled) {
                    userVideo.current.srcObject.getVideoTracks()[0].enabled = false;

                    self_displayName.style.bottom = "50%";
                    self_displayName.style.left = "30%";
                    self_displayName.style.right = '30%';
                    self_displayName.style.background = 'none';
                    self_displayName.style.fontSize = '20px';
                    mute_button.style.filter = "invert(100%)";
                    self_mute_icon.style.height = "18px";
                    setVideoOn(false);
                    socketRef.current.emit("update user status", {videoOn: false, mute: mute});
                } else {
                    userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
                    self_displayName.style = null;
                    mute_button.style.filter = null;
                    self_mute_icon.style.height = null;
                    setVideoOn(true);
                    socketRef.current.emit("update user status", {videoOn: true, mute: mute});
                }
            }
        }
    }

    const disconnect = () => {
        socketRef.current.emit("end call");
        socketRef.current.off();
        for (let index = 0; index < peersRef.current.length; index++) {
            peersRef.current[index].peer.destroy();
        }

        if (userVideo.current.srcObject !== null) {

            if (userVideo.current.srcObject.getAudioTracks()[0]) {
                userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
            }

            if (userVideo.current.srcObject.getVideoTracks()[0]) {
                userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
            }
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

        const userInfoStyle = peersRef.current[index].userStatus.videoOn ?
            {}
            : {bottom: "50%", left: "30%", right: "30%", background: "none", fontSize: "20px"};

        const muteIconStyle = peersRef.current[index].userStatus.videoOn ?
            {}
            : {height: "18px"};

        if (peersRef.current[index].userStatus.mute) {
            muteIconStyle.display = "block";
        }

        return (
            <div className="view_port_wrap">
                <video className="vid_viewport" playsInline autoPlay ref={ref}/>
                <div className="user_info" style={userInfoStyle}>
                    {peersRef.current[index].displayName}
                    <img className="status_mute" src={muteIcon} style={muteIconStyle} alt="mute"/>
                </div>
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
                            <div className="user_info self">
                                {userData.displayName}
                                <img className="status_mute self_mute" src={muteIcon} alt="self_mute"/>
                            </div>
                        </div>
                    </div>
                    <div className="menu_board">
                        <div className="room_btn" onClick={mute_audio}>
                            <img className="icons" src={muteIcon} alt="mute"/>
                        </div>
                        <div className="room_btn" onClick={mute_video}>
                            <img className="icons" src={muteCamIcon} alt="muteCam"/>
                        </div>
                        <div className="room_btn" onClick={disconnect}>
                            <img className="icons icon_margin" src={logoutIcon} alt="logout"/>
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
