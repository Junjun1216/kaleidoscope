import {Link} from "react-router-dom";
import React from "react";
import "../css/home_footer.css";
import facebook from "../resources/facebook.png";
import linkedin from "../resources/linkedln.png";
import github from "../resources/github.png";
import about from "../resources/about_icon.png";

const HomeFooter = () => {

    return (
        <div className="home_footer">
            <Link to="/about">
                <picture>
                    <source media="(min-width: 400px)" srcSet={about}/>
                    <img className="icon_links" src={about} alt="about_icon"/>
                </picture>
            </Link>
            <a target="_blank" href="https://www.facebook.com/michaelchen1216/" rel="noreferrer">
                <picture>
                    <source media="(min-width: 400px)" srcSet={facebook}/>
                    <img className="icon_links" src={facebook} alt="facebook_icon"/>
                </picture>
            </a>
            <a target="_blank" href="https://github.com/Junjun1216" rel="noreferrer">
                <picture>
                    <source media="(min-width: 400px)" srcSet={github}/>
                    <img className="icon_links" src={github} alt="github_icon"/>
                </picture>
            </a>
            <a target="_blank" href="https://www.linkedin.com/in/junchao-chen-17816b145/" rel="noreferrer">
                <picture>
                    <source media="(min-width: 400px)" srcSet={linkedin}/>
                    <img className="icon_links" src={linkedin} alt="linkedin_icon"/>
                </picture>
            </a>
        </div>
    )
}

export default HomeFooter;