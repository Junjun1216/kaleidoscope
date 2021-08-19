import React from "react";
import PropTypes from "prop-types";

const Icon = ({ url, alt, className, iconClass }) => {
    return (
        <div className={className}>
            <img className={iconClass} src={url} alt={alt}/>
        </div>
    )
}

Icon.propTypes = {
    url: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
    iconClass: PropTypes.string
}

export default Icon;