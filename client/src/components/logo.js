import PropTypes from 'prop-types';
import logo from "../resources/logo_trans.png";
import title from "../resources/word_white.png";
// 250px - 100px vertical
// 300px - 150px horizontal
const Logo = ({className}) => {

    return (
        <div className={className}>
            <picture>
                <source media="(min-width: 400px)" srcSet={title}/>
                <img src={title} alt="title" style={{width: '250px', height: 'auto', margin: '0 0 10px 5px'}}/>
            </picture>
            <picture>
                <source media="(min-width: 400px)" srcSet={logo}/>
                <img src={logo} alt="logo" style={{width: '100px', height: 'auto'}}/>
            </picture>
        </div>
    )
}

Logo.propTypes = {
    className: PropTypes.string
}

export default Logo;