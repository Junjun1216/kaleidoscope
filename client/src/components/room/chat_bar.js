import React, { useEffect, useRef, useState } from "react";
import userLogo from "../../resources/user_room.png";

const ChatBar = ({roomID, socketConnection, userData, roomData, peersRef}) => {
    const [chatEntry, setChatEntry] = useState("");
    const [chatData, setChatData] = useState([{displayName: "guest1", message: "this is methis is methis is methis is methis is methis is me", time: "18:48", id: 123}, {displayName: "guest2", message: "this is me2", time: "18:56", id: "612b062dde6fa75bf40d29d8"}]);

    const ChatEntry = ({ chatEntry, index }) => {
        if (chatEntry.id === userData.id) {
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
                            {chatEntry.time}
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
                            {chatEntry.time}
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="side_bar">
            <div className="members">
                <div className="room_name">{roomData.roomName}</div>
                <div className="user_display self_display">
                    <img className="room_logo" src={userLogo} alt="userLogo"/>
                    {userData.displayName}
                </div>
                {/*{peersRef.current.map((peer, index) => {*/}
                {/*    return (*/}
                {/*        <div className="user_display" key={index}>*/}
                {/*            <img className="room_logo" src={userLogo} alt="userLogo"/>*/}
                {/*            <div className="display_name">{userData.displayName}</div>*/}
                {/*        </div>*/}
                {/*    );*/}
                {/*})}*/}
            </div>
            <div className="scrollable_chat">
                {chatData.map((chatEntry, index) => {
                    return (
                        <ChatEntry key={index} chatEntry={chatEntry} index={index}/>
                    );
                })}
            </div>
            <div className="message_wrap">
                <textarea className="message_box" placeholder="Message Room" value={chatEntry} rows="2" cols="50"
                          onChange={(e) => setChatEntry(e.target.value)} />
            </div>
        </div>
    )
}

export default ChatBar;