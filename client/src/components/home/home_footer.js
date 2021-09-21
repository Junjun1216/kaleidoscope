import React from "react";
import "../../css/home/home_footer.css";
import about from "../../resources/about_icon.png";
import contact from "../../resources/notebook-of-contacts.png";
import source from "../../resources/open-source.png";
import kLogo from "../../resources/logo_trans.png";

const HomeFooter = ({navTo, footerRef}) => {

    return (
        <div className="home_footer" ref={footerRef}>
            <div className="img_wrap" onClick={e => navTo("home")}>
                <picture>
                    <source media="(min-width: 400px)" srcSet={kLogo}/>
                    <img className="icon_links" src={kLogo} alt="kaleidoscope_logo"/>
                </picture>
            </div>
            <div className="img_wrap" onClick={e => navTo("about")}>
                <picture>
                    <source media="(min-width: 400px)" srcSet={about}/>
                    <img className="icon_links about_link" src={about} alt="about_icon"/>
                </picture>
            </div>
            <div className="img_wrap" onClick={e => navTo("contact")}>
                <picture>
                    <source media="(min-width: 400px)" srcSet={contact}/>
                    <img className="icon_links" src={contact} alt="contact_icon"/>
                </picture>
            </div>
            <div className="img_wrap" onClick={e => navTo("credit")}>
                <picture>
                    <source media="(min-width: 400px)" srcSet={source}/>
                    <img className="icon_links" src={source} alt="source_icon"/>
                </picture>
            </div>
        </div>
    )
}

export default HomeFooter;