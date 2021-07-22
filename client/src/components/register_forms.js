import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Register_forms = ({submitForms}) => {

    const [emailText, setEmail] = useState('')
    const [usernameText, setUser] = useState('')
    const [passwordText, setPass] = useState('')

    const onSubmit = (e) => {
        e.preventDefault();

        submitForms({emailText, usernameText, passwordText})
        setEmail('')
        setUser('')
        setPass('')
    }

    return (
        <form className="register_forms" onSubmit={onSubmit}>
            <div className="forms">
                <label>Email</label><br/>
                <input type="email" value={emailText}
                       onChange={(e) => setEmail(e.target.value)} />
            </div>
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
    )
}

Register_forms.propTypes = {
    updateForms: PropTypes.func
}

export default Register_forms;