import React from "react";
import "../../css/dashboard/table_row.css";

const TableRow = ({date, roomName, desc, link, index}) => {

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.origin + "/room/" + link);
        let popup = document.getElementsByClassName("popUpText")[index];
        popup.classList.toggle("show");
    }

    return (
        <div className="table_row">
            <div className="row_elements">
                <span className="row_element element_margin">
                    {date}
                </span>
                <span className="row_element">
                    {roomName}
                </span>
                <span className="row_element description_width">
                    {desc}
                </span>
                <button className="btn_element popUp" onClick={copyLink}>
                    <span className="popUpText">Copied Link To ClickBoard!</span>
                    {link}
                </button>
            </div>
            <hr/>

        </div>
    )
}

export default TableRow;