import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../css/login_forms.css";
import logo from "../resources/logo_trans.png";

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
            <div id="logo">
                <picture>
                    <source media="(min-width: 800px)" srcSet={logo}/>
                    <img src={logo} alt="logo"/>
                </picture>
            </div>
            <form className="login_forms" onSubmit={onSubmit}>
                <div className="forms">
                    <label>Username</label><br/>
                    <input type="text" value={usernameText}
                           onChange={(e) => setUser(e.target.value)} />
                </div>
                <div className="forms">
                    <label>Password</label><br/>
                    <input type="password" value={passwordText}
                           onChange={(e) => setPass(e.target.value)} />
                </div>
                <input type="submit" value="submit"/>
            </form>
        </div>
    )
}

Login_forms.propTypes = {
    updateForms: PropTypes.func
}

export default Login_forms;