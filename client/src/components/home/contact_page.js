import React from "react";

import "../../css/home/contact_page.css";
import contact from "../../resources/contact.png";
import source from "../../resources/open-source.png";
import linkedin from "../../resources/linkedln.png";
import github from "../../resources/github.png";
import call from "../../resources/phone-call.png";
import mail from "../../resources/mail.png";

const ContactPage = ({contactRef}) => {
    return (
        <div className="contact_page" ref={contactRef}>
            <div className="contact_content">
                <div className="contact_title">
                    Contact
                </div>
                <div className="contact_options">
                    <div className="contact_link_wrap">
                        <picture>
                            <source media="(min-width: 400px)" srcSet={linkedin}/>
                            <img className="contact_link_icon" src={linkedin} alt="linkedin_icon"/>
                        </picture>
                        <a className="contact_link_label" target="_blank" href="https://www.linkedin.com/in/junchao-chen-17816b145/" rel="noreferrer">
                            https://www.linkedin.com/in/junchao-chen-17816b145/
                        </a>
                    </div>
                    <div className="contact_link_wrap">
                        <picture>
                            <source media="(min-width: 400px)" srcSet={github}/>
                            <img className="contact_link_icon contact_link_icon_height" src={github} alt="github_icon"/>
                        </picture>
                        <a className="contact_link_label" target="_blank" href="https://github.com/Junjun1216" rel="noreferrer">
                            https://github.com/Junjun1216
                        </a>
                    </div>
                    <div className="contact_link_wrap">
                        <picture>
                            <source media="(min-width: 400px)" srcSet={mail}/>
                            <img className="contact_link_icon contact_link_icon_height" src={mail} alt="phone_call_icon"/>
                        </picture>
                        <div className="contact_link_label">
                            michael1216.chen@hotmail.com
                        </div>
                    </div>
                    <div className="contact_link_wrap">
                        <picture>
                            <source media="(min-width: 400px)" srcSet={call}/>
                            <img className="contact_link_icon contact_link_icon_height" src={call} alt="phone_call_icon"/>
                        </picture>
                        <div className="contact_link_label">
                            +1 647-716-7580
                        </div>
                    </div>
                </div>
            </div>
            <picture>
                <source media="(min-width: 400px)" srcSet={contact}/>
                <img className="about_background" src={contact} alt="contact_people"/>
            </picture>
        </div>
    )
}

export default ContactPage;