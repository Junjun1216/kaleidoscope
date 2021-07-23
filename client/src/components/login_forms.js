import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import Logo from "./logo";
import "../css/login_forms.css";


const Login_forms = ({submitForms}) => {

    const [usernameText, setUser] = useState('')
    const [passwordText, setPass] = useState('')

    const onSubmit = (e) => {
        e.preventDefault();

        submitForms({usernameText, passwordText})
        setUser('')
        setPass('')
    }

    return (
        <div className="login_page">
            <Link to="/">
                <Logo className={'logo'}/>
            </Link>
            <div className="login_box">
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
    submitForms: PropTypes.func
}

export default Login_forms;