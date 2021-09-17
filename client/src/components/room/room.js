import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "../../css/room/room.css";

import VideoCall from "./video_call";
import ChatBar from "./chat_bar";

const Room = (props) => {
    const tempID = Math.floor(Math.random() * 10000);
    const [userData, setUserData] = useState({displayName: "guest " + tempID, userID: tempID});
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
            <ChatBar socketConnection={socketRef.current} userData={userData}/>
        </div>
    );
};

export default Room;
