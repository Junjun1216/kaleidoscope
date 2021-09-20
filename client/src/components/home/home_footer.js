import {Link} from "react-router-dom";
import React from "react";
import "../../css/home/home_footer.css";
import facebook from "../../resources/facebook.png";
import linkedin from "../../resources/linkedln.png";
import github from "../../resources/github.png";
import about from "../../resources/about_icon.png";
import contact from "../../resources/notebook-of-contacts.png";
import source from "../../resources/open-source.png";

const HomeFooter = () => {

    return (
        <div className="home_footer">
            <div className="img_wrap">
                <picture>
                    <source media="(min-width: 400px)" srcSet={about}/>
                    <img className="icon_links about_link" src={about} alt="about_icon"/>
                </picture>
            </div>
            <div className="img_wrap">
                <picture>
                    <source media="(min-width: 400px)" srcSet={contact}/>
                    <img className="icon_links" src={contact} alt="contact_icon"/>
                </picture>
            </div>
            <div className="img_wrap">
                <picture>
                    <source media="(min-width: 400px)" srcSet={source}/>
                    <img className="icon_links" src={source} alt="source_icon"/>
                </picture>
            </div>
            {/*<a target="_blank" href="https://www.facebook.com/michaelchen1216/" rel="noreferrer">*/}
            {/*    <picture>*/}
            {/*        <source media="(min-width: 400px)" srcSet={facebook}/>*/}
            {/*        <img className="icon_links" src={facebook} alt="facebook_icon"/>*/}
            {/*    </picture>*/}
            {/*</a>*/}
            {/*<a target="_blank" href="https://github.com/Junjun1216" rel="noreferrer">*/}
            {/*    <picture>*/}
            {/*        <source media="(min-width: 400px)" srcSet={github}/>*/}
            {/*        <img className="icon_links" src={github} alt="github_icon"/>*/}
            {/*    </picture>*/}
            {/*</a>*/}
            {/*<a target="_blank" href="https://www.linkedin.com/in/junchao-chen-17816b145/" rel="noreferrer">*/}
            {/*    <picture>*/}
            {/*        <source media="(min-width: 400px)" srcSet={linkedin}/>*/}
            {/*        <img className="icon_links" src={linkedin} alt="linkedin_icon"/>*/}
            {/*    </picture>*/}
            {/*</a>*/}
        </div>
    )
}

export default HomeFooter;