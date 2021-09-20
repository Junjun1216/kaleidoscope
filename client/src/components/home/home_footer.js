import React from "react";
import "../../css/home/home_footer.css";
import about from "../../resources/about_icon.png";
import contact from "../../resources/notebook-of-contacts.png";
import source from "../../resources/open-source.png";

const HomeFooter = ({navTo}) => {

    return (
        <div className="home_footer">
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
            <div className="img_wrap" onClick={e => navTo("source")}>
                <picture>
                    <source media="(min-width: 400px)" srcSet={source}/>
                    <img className="icon_links" src={source} alt="source_icon"/>
                </picture>
            </div>
        </div>
    )
}

export default HomeFooter;