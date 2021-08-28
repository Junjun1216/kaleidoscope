import React, { useEffect, useState } from "react";
import "../../css/dashboard/account_forms.css";

const AccountForms = () => {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("placeholder");
    const [updatedDisplayName, setUpdateDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [updatedEmail, setUpdateEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [updatedPassword, setUpdatedPassword] = useState("");
    const [confirmUpdatedPassword, setConfirmUpdatedPassword] = useState("");

    useEffect(() => {

    }, [])

    const updateDisplayName = (e) => {
        e.preventDefault();

        console.log(updatedDisplayName);
        setUpdateDisplayName("");
    }

    const updateEmail = (e) => {
        e.preventDefault();

        console.log(updatedEmail);
        console.log(confirmPassword);
        setUpdateEmail("");
        setConfirmPassword("");
    }

    const updatePassword = (e) => {
        e.preventDefault();

        if (updatedPassword === confirmUpdatedPassword) {
            console.log("confirmed");
        }

        console.log(currentPassword);
        console.log(updatedPassword);
        console.log(confirmUpdatedPassword);
        setCurrentPassword("");
        setUpdatedPassword("");
        setConfirmUpdatedPassword("");
    }

    return (
        <div className="account_content">
            <div className="account_background">
                <form className="account_form account_form_margin" onSubmit={updateDisplayName}>
                    <div className="form_row">
                        <span className="section_label">
                            Username
                        </span>
                        <div className="form_element">
                            <input className="form_input_element" type="text" name="username" value={username} readOnly/>
                        </div>
                    </div>
                </form>
                <hr className="account"/>
                <form className="account_form" onSubmit={updateDisplayName}>
                    <div className="form_row">
                        <span className="section_label">
                            Display Name
                        </span>
                        <div className="form_element">
                            <input className="form_input_element" type="text" name="displayName" value={displayName} readOnly/>
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_element form_margin">
                            <input className="form_input_element" type="text" name="updateDisplayName" placeholder="Enter New Display Name" required
                                   value={updatedDisplayName} onChange={(e) => setUpdateDisplayName(e.target.value)} />
                        </div>
                        <input className="accountBtn" type="submit" value="Update"/>
                    </div>
                </form>
                <hr className="account"/>
                <form className="account_form" onSubmit={updateEmail}>
                    <div className="form_row">
                        <span className="section_label">
                            Email
                        </span>
                        <div className="form_element">
                            <input className="form_input_element" type="text" name="email" value={email} readOnly/>
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_element form_margin">
                            <input className="form_input_element" type="text" name="updateEmail" placeholder="Enter New Email" required
                                   value={updatedEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_element form_margin">
                            <input className="form_input_element" type="text" name="confirmPass" placeholder="Confirm Password" required
                                   value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <input className="accountBtn" type="submit" value="Update"/>
                    </div>
                </form>
                <hr className="account"/>
                <form className="account_form" onSubmit={updatePassword}>
                    <div className="form_row">
                        <span className="section_label">
                            Password
                        </span>
                        <div className="form_element">
                            <input className="form_input_element" type="text" name="confirmPassword" placeholder="Confirm Current Password" required
                                   value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_element form_margin">
                            <input className="form_input_element" type="text" name="updatedPassword" placeholder="Enter New Password" required
                                   value={updatedPassword} onChange={(e) => setUpdatedPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_element form_margin">
                            <input className="form_input_element" type="text" name="confirmUpdatedPassword" placeholder="Confirm New Password" required
                                   value={confirmUpdatedPassword} onChange={(e) => setConfirmUpdatedPassword(e.target.value)} />
                        </div>
                        <input className="accountBtn" type="submit" value="Update"/>
                    </div>
                </form>
                <hr className="account"/>
            </div>
        </div>
    )
}

export default AccountForms;