import React from "react";

import "../../css/home/phantom_footer.css";

const PhantomFooter = ({phantomFooterRef}) => {
    return (
        <div className="phantom_footer" ref={phantomFooterRef}/>
    )
}

export default PhantomFooter;