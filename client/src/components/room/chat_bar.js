import React, { useEffect, useState } from "react";

import userLogo from "../../resources/user_room.png";

import "../../css/room/chat_bar.css";

const ChatBar = ({socketConnection, userData}) => {
    const [chatEntry, setChatEntry] = useState("");
    const [chatData, setChatData] = useState([]);
    const [users, setUsers] = useState([]);
    const [roomData, setRoomData] = useState({});

    useEffect(() => {
        if (socketConnection) {
            socketConnection.on("all messages", (messages) => {
                setChatData(messages);
            })

            socketConnection.on("all users", ({users, roomData}) => {
                setUsers(users);
                setRoomData(roomData);
            })

            socketConnection.on("user joined", (payload) => {
                setUsers(oldUser => [...oldUser, {
                    id: payload.callerID,
                    displayName: payload.displayName,
                    userStatus: payload.userStatus
                }])
            })

            socketConnection.on("update users", users => {
                let newUsers = users.filter(user => user.id !== socketConnection.id);
                setUsers(newUsers);
            });
        }

    }, [socketConnection])

    useEffect(() => {
        const chat = document.getElementsByClassName("scrollable_chat")[0];
        chat.scrollTop = chat.scrollHeight;
    }, [chatData])

    const messageGroup = (e) => {
        if(socketConnection && userData && chatEntry) {
            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                socketConnection.emit("message to room", {message: chatEntry, date: new Date(), displayName: userData.displayName, userID: userData.userID});
                setChatEntry("");
            }
        }
    }

    const dateToTime = (date) => {
        const localDate = new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: 'Canada/Eastern'}));
        return localDate.toString().slice(16, 21);
    }

    const ChatEntry = ({ chatEntry, index }) => {
        if (chatEntry.userID === userData.userID) {
            return (
                <div className="chat_wrap chat_wrap_self">
                    <div className="user_name user_name_self">
                        {chatEntry.displayName}
                    </div>
                    <div className="chat_entry_wrap_self" id={index} >
                        <div className="chat_entry">
                            {chatEntry.message}
                        </div>
                        <div className="time">
                            {dateToTime(chatEntry.date)}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="chat_wrap">
                    <div className="user_name">
                        {chatEntry.displayName}
                    </div>
                    <div className="chat_entry_wrap" id={index} >
                        <div className="chat_entry">
                            {chatEntry.message}
                        </div>
                        <div className="time">
                            {dateToTime(chatEntry.date)}
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="side_bar">
            <div className="room_name">
                <div className="chat_label">
                    Room Name
                </div>
                {roomData.roomName}
            </div>
            <div className="members">
                <div className="chat_label">
                    Members
                </div>
                <div className="user_display self_display">
                    <img className="room_logo" src={userLogo} alt="userLogo"/>
                    {userData.displayName}
                </div>
                {users.map((peer, index) => {
                    return (
                        <div className="user_display" key={index}>
                            <img className="room_logo" src={userLogo} alt="userLogo"/>
                            <div className="display_name">{peer.displayName}</div>
                        </div>
                    );
                })}
            </div>
            <div className="scrollable_chat">
                <div className="chat_label">
                    Chat Begins Here
                </div>
                {chatData.map((chatEntry, index) => {
                    return (
                        <ChatEntry key={index} chatEntry={chatEntry} index={index}/>
                    );
                })}
            </div>
            <div className="message_wrap">
                <textarea className="message_box" placeholder="Message Room" value={chatEntry} rows="2" cols="50"
                          onChange={(e) => setChatEntry(e.target.value)} onKeyDown={messageGroup}/>
            </div>
        </div>
    )
}

export default ChatBar;