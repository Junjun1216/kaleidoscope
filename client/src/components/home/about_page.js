import React from "react";

import "../../css/home/about_page.css"
import socketIo from "../../resources/socketio.png";
import react from "../../resources/react_logo.png";
import express from "../../resources/express.png";
import passport from "../../resources/passport.png";
import mongo from "../../resources/mongo.png";
import opensource from "../../resources/open-source.png";

import building from "../../resources/building_website.png";

const AboutPage = ({aboutRef}) => {

    return (
        <div className="about_page" ref={aboutRef}>
            <picture>
                <source media="(min-width: 400px)" srcSet={building}/>
                <img className="about_background" src={building} alt="people_building_website"/>
            </picture>
            <div className="about_content">
                <div className="about_title">
                    About Kaleidoscope
                </div>
                <div className="about_desc">
                    Kaleidoscope is a peer to peer video conferencing application that features
                    user authentication, room creation, and video/chat based conferencing.
                </div>
                <div className="about_desc about_desc_margin">
                    Built using the MERN stack and various other modern Node JS Based open source software
                </div>
                <div className="feature_list">
                    <div className="about_feature">
                        <div className="about_image_wrap">
                            <picture>
                                <source media="(min-width: 400px)" srcSet={socketIo}/>
                                <img className="about_images" src={socketIo} alt="plug_icon"/>
                            </picture>
                        </div>
                        <div className="about_image_desc">
                            Socket IO for room creation and mediating Peer To Peer Connections
                        </div>
                    </div>
                    <div className="about_feature">
                        <div className="about_image_wrap">
                            <picture>
                                <source media="(min-width: 400px)" srcSet={react}/>
                                <img className="about_images" src={react} alt="react_icon"/>
                            </picture>
                        </div>
                        <div className="about_image_desc">
                            React JS and React Hooks for the frontend UI
                        </div>
                    </div>
                    <div className="about_feature">
                        <div className="about_image_wrap">
                            <picture>
                                <source media="(min-width: 400px)" srcSet={express}/>
                                <img className="about_images2" src={express} alt="express_icon"/>
                            </picture>
                        </div>
                        <div className="about_image_desc">
                            Express JS for the backend REST API
                        </div>
                    </div>
                    <div className="about_feature">
                        <div className="about_image_wrap">
                            <picture>
                                <source media="(min-width: 400px)" srcSet={passport}/>
                                <img className="about_images" src={passport} alt="passport_logo"/>
                            </picture>
                        </div>
                        <div className="about_image_desc">
                            Passport JS for user authentication
                        </div>
                    </div>
                    <div className="about_feature">
                        <div className="about_image_wrap">
                            <picture>
                                <source media="(min-width: 400px)" srcSet={mongo}/>
                                <img className="about_images" src={mongo} alt="mongo_logo"/>
                            </picture>
                        </div>
                        <div className="about_image_desc">
                            Mongo DB and Mongoose ODM for backend storage
                        </div>
                    </div>
                    <div className="about_feature">
                        <div className="about_image_wrap">
                            <picture>
                                <source media="(min-width: 400px)" srcSet={opensource}/>
                                <img className="about_images3" src={opensource} alt="opensource_icon"/>
                            </picture>
                        </div>
                        <div className="about_image_desc">
                            Various other open source node software such as simple peer
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AboutPage;