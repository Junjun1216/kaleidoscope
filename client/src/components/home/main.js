import React from "react";

import Logo from "./logo";
import {Link} from "react-router-dom";

import "../../css/home/main.css";
import conference from "../../resources/remote-meeting-bro.png";

const Main = () => {

    return (
        <div className="main">
            <div className="content">
                <div className="intro_block">
                    <Logo className="home_title" style_title={{ width: '400px', height: 'auto', margin: '10px 0 0 15px'}}
                          style_logo={{display: "none", width: '75px', height: 'auto'}}/>
                    <div className="home_description">
                        A Simple Peer To Peer Video Conferencing Application Created With Express/React JS
                    </div>
                    <Link to="/register">
                        <input className="desc_btn" type="button" value="Learn More"/>
                    </Link>
                </div>
                <div className="image_block">
                    <div className="home_btns">
                        <Link to="/login">
                            <input className="home_btn" type="button" value="Login"/>
                        </Link>
                        <Link to="/register">
                            <input className="home_btn" type="button" value="Register"/>
                        </Link>
                        <input className="home_btn contact_btn" type="button" value="Contact"/>
                    </div>
                    <picture>
                        <source media="(min-width: 400px)" srcSet={conference}/>
                        <img className="home_graphics" src={conference} alt="conference"/>
                    </picture>
                </div>
            </div>
        </div>
    )
}

export default Main;