import PropTypes from 'prop-types';
import logo from "../../resources/logo_trans.png";
import title from "../../resources/word_white.png";
// 250px - 100px vertical
// 300px - 150px horizontal
const Logo = ({className, style_title, style_logo}) => {

    return (
        <div className={className}>
            <picture>
                <source media="(min-width: 400px)" srcSet={title}/>
                <img src={title} alt="title" style={style_title}/>
            </picture>
            <picture>
                <source media="(min-width: 400px)" srcSet={logo}/>
                <img src={logo} alt="logo" style={style_logo}/>
            </picture>
        </div>
    )
}

Logo.propTypes = {
    className: PropTypes.string,
    style_title: PropTypes.object,
    style_logo: PropTypes.object
}

export default Logo;