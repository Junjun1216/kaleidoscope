import React from "react";

import credit from "../../resources/credit.png";

import "../../css/home/credit.css";

const Credit = ({creditRef}) => {
    return (
        <div className="credit" ref={creditRef}>
            <picture>
                <source media="(min-width: 400px)" srcSet={credit}/>
                <img className="credit_image" src={credit} alt="linkedin_icon"/>
            </picture>
            <div className="credit_section">
                <div className="disclaimer_title">
                    Disclaimer
                </div>
                <div className="disclaimer_desc">
                    Kaleidoscope is not affiliated and does not take credit to the artwork and resources used on this
                    page with the exception of the Kaleidoscope Title and Logo. All art illustrations and icons goes to
                    the the sources listed below. All open source software logo is credited to their respective author.
                    Kaleidoscope does not make any revenue and is built purely for learning and demonstration purposes.
                </div>
                <a className="credit_list" href="https://www.freepik.com/">
                    https://www.freepik.com/ (various background artwork used on this page)
                </a>
                <a className="credit_list" href="https://www.flaticon.com/">
                    https://www.flaticon.com/ (various icons used on this page)
                </a>
                <div className="disclaimer_title disclaimer_margin">
                    Author's Note
                </div>
                <div className="disclaimer_desc">
                    Special Thanks to Joy Wang for helping me design the title And logo as well as providing feedback
                    for the various graphic design elements of this site.
                </div>
                <a className="credit_list" href="https://www.linkedin.com/in/jywang77/">
                    Her LinkedIn can be found Here
                </a>
                <div className="credit_note">
                    Please Contact The Author Before Using Resources From This Site*
                </div>
            </div>
        </div>
    )
}

export default Credit;