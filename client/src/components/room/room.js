import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import "../../css/room/room.css";

import muteIcon from "../../resources/mute.png";
import muteCamIcon from "../../resources/no-camera.png";
import logoutIcon from "../../resources/logout.png";
import userLogo from "../../resources/user_room.png";
import VideoCall from "./video_call";
import ChatBar from "./chat_bar";

const Room = (props) => {
    const [userData, setUserData] = useState({displayName: "guest " + Math.floor(Math.random() * 10000), id: 123456});
    const [roomData, setRoomData] = useState({roomName: "hi"});
    const [fetchedData, setFetchedData] = useState(false);

    const socketRef = useRef();
    const roomID = props.match.params.roomID;

    useEffect(() => {
        const fetchData = async () => {
            socketRef.current = io.connect("/", {"sync disconnect on unload": true});

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
                if (data !== undefined) {
                    setUserData(data);
                }
                setFetchedData(true);
            }).catch(err => {
                console.log(err)
            })
        }

        fetchData();
    }, []);

    return (
        <div className="room">
            <VideoCall roomID={roomID} socketConnection={socketRef.current} userData={userData} fetchedData={fetchedData}/>
            <ChatBar roomID={roomID} socketConnection={socketRef.current} userData={userData} roomData={roomData}/>
        </div>
    );
};

export default Room;
