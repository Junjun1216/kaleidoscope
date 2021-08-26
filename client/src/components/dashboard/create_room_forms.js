import React, {useState} from "react";
import Icon from "./icon";
import {v1 as uuid} from "uuid";
import "../../css/dashboard/create_room_forms.scss";
import video_cam from "../../resources/video-camera.png";
import join_room from "../../resources/open-door.png";


const CreateRoomForms = () => {

    const [room_name, set_room_name] = useState("");
    const [description, set_description] = useState("");
    const [audio_only, set_audio_only] = useState(false);
    const [room_id, set_room_id] = useState("");
    const [room_link, set_room_link] = useState("");
    const [join_room_field, set_join_room_field] = useState("");
    const [join_room_err, set_join_room_err] = useState(200);

    const createRoom = async (e) => {
        e.preventDefault();

        const generated_room_id = uuid();
        const date_now = new Date();
        const url = "/api/createRoom";
        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            },
            credentials: "include",
            redirect: "follow",
            body: JSON.stringify({
                roomLink: generated_room_id,
                date: date_now,
                roomName: room_name,
                description: description,
                audioOnly: audio_only
            })
        };

        await fetch(url, options)
            .then(res => {
                if (res.status === 200) {
                    set_room_link(window.location.origin + `/room/${generated_room_id}`);
                    set_room_id(generated_room_id);
                } else {
                    console.log(res);
                }
            });

        set_description("");
        set_room_name("");
        set_audio_only(false);
    }

    const copyLink = (e) => {
        e.preventDefault();

        navigator.clipboard.writeText(room_link);
    }

    const openMeeting = (e) => {
        e.preventDefault();

        const win = window.open(room_link, "_blank");
        win.focus();
        navigator.clipboard.writeText(room_link);
    }

    const joinMeeting = async (e) => {
        e.preventDefault();

        const url = "/api/validateMeeting/";
        const options = {
            headers : {
                'Accept': 'application/json'
            },
            credentials: "include"
        };
        let query = join_room_field;

        if (join_room_field.search("room") !== -1) {
            query = join_room_field.slice(join_room_field.search("room") + 5);
        }

        await fetch(url + query, options).then(res => {
            if (res.status === 200) {
                const win = window.open(window.location.origin + `/room/${join_room_field}`, "_blank");
                win.focus();
                set_join_room_err(200);
            } else {
                set_join_room_err(404);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="create_room_content">
            <div className="left_panel">
                <Icon url={video_cam}
                      alt={"videocam"}
                      className={"panel_icon_background"}
                      iconClass={"panel_icon"}
                />
                <form className="room_form" onSubmit={createRoom}>
                    <div className="form">
                        <input className="form_input" type="text" name="title" placeholder="Title" required
                               value={room_name} onChange={(e) => set_room_name(e.target.value)} />
                        <label className="form_label" htmlFor="form_input">Title</label>
                    </div>
                    <div className="description">
                        <textarea className="description_input" placeholder="Description..." value={description} rows="2" cols="50"
                               onChange={(e) => set_description(e.target.value)} />
                        <label className="description_label" htmlFor="description_input">Description (Optional)</label>
                    </div>
                    <div className="checkboxes">
                        <label className="checkbox_label" htmlFor="checkbox">
                            Audio Only
                            <input className="checkbox" type="checkbox" name="audioOnly"
                                   checked={audio_only} onChange={(e) => set_audio_only(e.target.checked)}/>
                        </label>
                    </div>
                    <input className="panel_btn" type="submit" value="Create Room"/>
                </form>
                { room_id !== "" ?
                    <div className="meeting_link">
                        <label className="link_label" htmlFor="link">Room Link</label>
                        <span className="link_label2">Please Send The Following Link To Participants*</span>
                        <input className="room_link" type="url" value={room_link} readOnly onClick={copyLink}/>
                        <div className="link_btns">
                            <input className="panel_btn btn_spacing" type="button" value="Copy" onClick={copyLink}/>
                            <input className="panel_btn" type="button" value="Open Room" onClick={openMeeting}/>
                        </div>
                    </div>
                    : null
                }
            </div>
            <div className="right_panel">
                <Icon url={join_room}
                      alt={"joinroom"}
                      className={"panel_icon_background panel_icon_background_spacing"}
                      iconClass={"panel_icon"}
                />
                <form className="join_form" onSubmit={joinMeeting}>
                    <div className="form form_flex">
                        { join_room_err !== 200 ?
                            <div className="join_err">
                                404 Room Not Found
                            </div>
                            : null
                        }
                        <input className="form_input input_align" type="text" name="form" placeholder="Room Link" required
                               value={join_room_field} onChange={(e) => set_join_room_field(e.target.value)} />
                        <label className="form_label" htmlFor="form_input">Please Enter Room Link Or Code</label>
                    </div>
                    <input className="panel_btn btn_spacing2" type="submit" value="Join Room"/>
                </form>
            </div>
        </div>
    )
}

export default CreateRoomForms;