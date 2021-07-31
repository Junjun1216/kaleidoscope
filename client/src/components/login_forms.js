import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import Logo from "./logo";
import "../css/login_forms.css";


const Login_forms = ({raiseUnauthorized, loginUser}) => {

    const [usernameText, setUser] = useState('')
    const [passwordText, setPass] = useState('')

    const onSubmit = (e) => {
        e.preventDefault();

        loginUser({usernameText, passwordText})
        setUser('')
        setPass('')
    }

    const UnauthorizedError = () => {
        return (
        <label className='error'>
            401 unauthorized
        </label>
        )
    }

    return (
        <div className="login_page">
            <Link to="/">
                <Logo className={'logo'} style_title={{width: '250px', height: 'auto', margin: '0 0 10px 5px'}} style_logo={{width: '100px', height: 'auto'}}/>
            </Link>
            <div className="login_box">
                { raiseUnauthorized ? <UnauthorizedError/> : null}
                <form className="login_forms" onSubmit={onSubmit}>
                    <div className="top_form forms">
                        <label>Username</label><br/>
                        <input type="text" value={usernameText} style={{width: "250px"}}
                               onChange={(e) => setUser(e.target.value)} />
                    </div>
                    <div className="forms">
                        <label>Password</label><br/>
                        <input type="password" value={passwordText} style={{width: "250px"}}
                               onChange={(e) => setPass(e.target.value)} />
                        <span className="forgot_pass">
                          <Link to="/fp" style={{float: "left"}}>Forgot Password?</Link>
                        </span>
                    </div>
                    <input className="submit_form" type="submit" value="Login"/>
                    <hr/>
                    <a href="http://localhost:3000/register">
                        <input className="register_btn" type="button" value="Register"/>
                    </a>
                </form>
            </div>
        </div>
    )
}

Login_forms.propTypes = {
    raiseUnauthorized: PropTypes.bool,
    loginUser: PropTypes.func.isRequired
}

export default Login_forms;