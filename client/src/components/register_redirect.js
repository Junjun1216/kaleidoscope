import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Logo from './logo';
import { NavLink, useHistory } from 'react-router-dom';
import '../css/register_redirect.css';

const Register_redirect = ({isSuccessful, message}) => {
    let history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            history.push('/login')
        }, 3000)
    })

    return (
        <div className='redirect_page'>
            <NavLink to="/">
                <Logo className={'logo'} style_title={{width: '300px', height: 'auto', margin: '0 0 10px 5px'}} style_logo={{width: '150px', height: 'auto'}}/>
            </NavLink>
            <div className='message_block'>
                {isSuccessful ? (
                    <span className='message'>
                    {message}
                    <br/>
                    You will be redirected shortly...
                    <br/>
                    <NavLink to="/login">Or Login Here</NavLink>
                    </span>
                    ) : (
                    <span className='message'>
                    {message}
                        <br/>
                    You will be redirected shortly...
                    <br/>
                    <NavLink to="/register">Or Click Here To Register</NavLink>
                    </span>
                )}
            </div>
        </div>
    )
}

Register_redirect.prototype = {
    isSuccessful: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired
}

export default Register_redirect;