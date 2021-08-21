import React, {useState} from "react";
import Icon from "./icon";
import {v1 as uuid} from "uuid";
import "../../css/dashboard/create_room_forms.scss";
import video_cam from "../../resources/video-camera.png";
import join_room from "../../resources/open-door.png";


const CreateRoomForms = () => {

    const [room_name, set_room_name] = useState("");
    const [description, set_description] = useState("");
    const [room_id, set_room_id] = useState("");

    const createRoom = (e) => {
        e.preventDefault();

        const generated_room_id = uuid();
        const win = window.open(`/room/${generated_room_id}`, "_blank");
        win.focus();
        set_room_id(generated_room_id);
        set_description("");
        set_room_name("");
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
                        <label className="title_label" htmlFor="title_input">Title</label><br/>
                    </div>
                    <div className="description">
                        <textarea className="description_input" placeholder="Description..." value={description} rows="2" cols="50"
                               onChange={(e) => set_description(e.target.value)} />
                        <label className="description_label" htmlFor="description_input">Description (Optional)</label><br/>
                    </div>
                    <input className="submit_room" type="submit" value="Create Room"/>
                </form>
            </div>
            <div className={"right_panel"}>
                <Icon url={join_room}
                      alt={"joinroom"}
                      className={"panel_icon_background"}
                      iconClass={"panel_icon"}
                />
            </div>
        </div>
    )
}

export default CreateRoomForms;