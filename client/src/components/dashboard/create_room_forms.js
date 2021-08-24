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

    const createRoom = (e) => {
        e.preventDefault();

        const generated_room_id = uuid();
        set_room_id(generated_room_id);
        set_room_link(window.location.origin + `/room/${generated_room_id}`);
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

    return (
        <div className="create_room_content">
            <div className="left_panel">
                <Icon url={video_cam}
                      alt={"videocam"}
                      className={"panel_icon_background"}
                      iconClass={"panel_icon"}
                />
                <form className="room_form" onSubmit={createRoom}>
                    <div className="title">
                        <input className="title_input" type="text" name="title" placeholder="Title" required
                               value={room_name} onChange={(e) => set_room_name(e.target.value)} />
                        <label className="title_label" htmlFor="title_input">Title</label>
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
                        <input className="room_link" type="url" value={room_link} readOnly onClick={copyLink}/>
                        <div className="link_btns">
                            <input className="panel_btn btn_spacing" type="button" value="Copy" onClick={copyLink}/>
                            <input className="panel_btn" type="button" value="Open Room" onClick={openMeeting}/>
                        </div>
                    </div>
                    : null
                }
            </div>
            <div className={"right_panel"}>
                <Icon url={join_room}
                      alt={"joinroom"}
                      className={"panel_icon_background"}
                      iconClass={"panel_icon"}
                />
                <form className="room_form" onSubmit={createRoom}>
                    {/*<div className="title">*/}
                    {/*    <input className="title_input" type="text" name="title" placeholder="Room Link" required*/}
                    {/*           value={room_name} onChange={(e) => set_room_name(e.target.value)} />*/}
                    {/*    <label className="title_label" htmlFor="title_input">Room Link</label>*/}
                    {/*</div>*/}
                    {/*<input className="panel_btn" type="submit" value="Open Room"/>*/}
                </form>
            </div>
        </div>
    )
}

export default CreateRoomForms;