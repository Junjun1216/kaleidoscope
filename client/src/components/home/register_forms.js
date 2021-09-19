import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import Logo from "./logo";
import "../../css/home/register_forms.css";


const Register_form = ({registerUser}) => {

    const [emailText, setEmail] = useState('')
    const [usernameText, setUser] = useState('')
    const [passwordText, setPass] = useState('')
    const [cPasswordText, setCPass] = useState('')
    const [unmatchingPass, setUnmatch] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault();
        if (passwordText === cPasswordText) {
            registerUser({emailText, usernameText, passwordText})
        } else {
            setUnmatch(true)
        }
        setEmail('')
        setUser('')
        setPass('')
        setCPass('')
    }

    const UnmatchingPassError = () => {
        return (
            <label className='error'>
                Error: confirm password must match password
            </label>
        )
    }

    return (
        <div className="register_page">
            <Link to="/home">
                <Logo className={'logo'} style_title={{width: '300px', height: 'auto', margin: '0 0 10px 5px'}} style_logo={{width: '150px', height: 'auto'}}/>
            </Link>
            <div className="register_box">
                { unmatchingPass ? <UnmatchingPassError/> : null}
                <form className="register_forms" onSubmit={onSubmit}>
                    <div className="top_form forms">
                        <label>Email</label><br/>
                        <input type="email" value={emailText} style={{width: "250px"}} required
                               onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="forms">
                        <label>Username</label><br/>
                        <input type="text" value={usernameText} style={{width: "250px"}} required
                               onChange={(e) => setUser(e.target.value)} />
                    </div>
                    <div className="forms">
                        <label>Password</label><br/>
                        <input type="password" value={passwordText} style={{width: "250px"}} required
                               onChange={(e) => setPass(e.target.value)} />
                    </div>
                    <div className="forms">
                        <label>Confirm Password</label><br/>
                        <input type="password" value={cPasswordText} style={{width: "250px"}} required
                               onChange={(e) => setCPass(e.target.value)} />
                    </div>
                    <input className="submit_form" type="submit" value="Register"/>
                </form>
                <hr/>
                <span className="nav_login">
                    <Link to="/login">Already have an account?</Link>
                </span>
            </div>
        </div>
    )
}

Register_form.propTypes = {
    submitForms: PropTypes.func
}

export default Register_form;