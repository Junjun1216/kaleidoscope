import React, {useEffect, useRef} from "react";

import Logo from "./logo";
import {Link} from "react-router-dom";

import "../../css/home/main.css";
import conference from "../../resources/remote-meeting-bro.png";
import { useOnScreen } from '@schibstedspain/sui-react-hooks'

const Main = ({navTo, footerRef, phantomFooterRef}) => {

    const [mainIsVisible, mainRef] = useOnScreen({ once: false })

    useEffect(() => {
        if (footerRef.current) {
            if (!mainIsVisible) {
                phantomFooterRef.current.style = "display: flex";
                footerRef.current.style = "position: fixed;top: 0;";
            } else {
                phantomFooterRef.current.style = null;
                footerRef.current.style = null;
            }
        }
    }, [mainIsVisible])

    return (
        <div className="main" ref={mainRef}>
            <div className="content">
                <div className="intro_block">
                    <Logo className="home_title" style_title={{ width: '400px', height: 'auto', margin: '10px 0 0 15px'}}
                          style_logo={{display: "none", width: '75px', height: 'auto'}}/>
                    <div className="home_description">
                        A Simple Peer To Peer Video Conferencing Application Created With Express/React JS
                    </div>
                    <input className="desc_btn" type="button" value="Learn More" onClick={e => navTo("about")}/>
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