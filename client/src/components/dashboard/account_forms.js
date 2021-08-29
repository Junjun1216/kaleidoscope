import React, { useEffect, useState } from "react";
import {Link, useHistory} from "react-router-dom";

import "../../css/dashboard/account_forms.css";

const AccountForms = () => {
    let history = useHistory();

    const [userData, setUserData] = useState({username: "", email: "", displayName: ""});
    const [updatedDisplayName, setUpdateDisplayName] = useState("");
    const [updatedEmail, setUpdateEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [updatedPassword, setUpdatedPassword] = useState("");
    const [confirmUpdatedPassword, setConfirmUpdatedPassword] = useState("");
    const [message, setMessage] = useState("");


    useEffect(() => {
        const fetchData = () => {
            const url = "/api/dashboard";
            const options = {
                headers : {
                    'Accept': 'application/json'
                },
                credentials: "include"
            };

            fetch(url, options).then(res => {
                if (res.status === 200) {
                    return res.json()
                }
                history.push("/login");
            }).then(data => {
                setUserData(data)
            }).catch(err => {
                console.log(err)
            })
        }

        fetchData();
    }, [history])

    const updateDisplayName = async (e) => {
        e.preventDefault();

        const url = "/api/updateDisplayName";
        const options = {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            },
            credentials: "include",
            body: JSON.stringify({
                displayName: updatedDisplayName,
            })
        };

        await fetch(url, options)
            .then(res => {
                if (res.status === 200) {
                    userData.displayName = updatedDisplayName;
                    document.getElementsByClassName("update_message")[0].style.color = "#96e265";
                    setMessage("Display Name Updated Successfully");
                } else {
                    document.getElementsByClassName("update_message")[0].style.color = "red";
                    setMessage("Display Name Update Failed")
                }
            });

        setUpdateDisplayName("");
    }

    const updateEmail = async (e) => {
        e.preventDefault();

        const url = "/api/updateEmail";
        const options = {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            },
            credentials: "include",
            body: JSON.stringify({
                email: updatedEmail,
                confirmPassword: confirmPassword
            })
        };

        await fetch(url, options)
            .then(res => {
                if (res.status === 200) {
                    userData.email = updatedEmail;
                    document.getElementsByClassName("update_message")[0].style.color = "#96e265";
                    setMessage("Email Updated Successfully");
                } else if (res.status === 401) {
                    document.getElementsByClassName("update_message")[0].style.color = "red";
                    setMessage("Invalid Password")
                } else {
                    document.getElementsByClassName("update_message")[0].style.color = "red";
                    setMessage("Email Update Failed")
                }
            });

        setUpdateEmail("");
        setConfirmPassword("");
    }

    const updatePassword = async (e) => {
        e.preventDefault();

        if (updatedPassword === confirmUpdatedPassword) {
            const url = "/api/updatePassword";
            const options = {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json;charset=UTF-8"
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    updatedPassword: updatedPassword,
                })
            };

            await fetch(url, options)
                .then(res => {
                    if (res.status === 200) {
                        document.getElementsByClassName("update_message")[0].style.color = "#96e265";
                        setMessage("Password Updated Successfully")
                    } else if (res.status === 401) {
                        document.getElementsByClassName("update_message")[0].style.color = "red";
                        setMessage("Invalid Password")
                    } else {
                        document.getElementsByClassName("update_message")[0].style.color = "red";
                        setMessage("Password Update Failed")
                    }
                });
        } else {
            document.getElementsByClassName("update_message")[0].style.color = "red";
            setMessage("Confirm New Password Does Not Match New Password")
        }

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
                            <input className="form_input_element" type="text" name="username" value={userData.username} readOnly/>
                        </div>
                    </div>
                </form>
                <form className="account_form" onSubmit={updateDisplayName}>
                    <div className="form_row">
                        <span className="section_label">
                            Display Name
                        </span>
                        <div className="form_element">
                            <input className="form_input_element" type="text" name="displayName" value={userData.displayName} readOnly/>
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
                <form className="account_form" onSubmit={updateEmail}>
                    <div className="form_row">
                        <span className="section_label">
                            Email
                        </span>
                        <div className="form_element">
                            <input className="form_input_element" type="email" name="email" value={userData.email} readOnly/>
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_element form_margin">
                            <input className="form_input_element" type="email" name="updateEmail" placeholder="Enter New Email" required
                                   value={updatedEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_element form_margin">
                            <input className="form_input_element" type="password" name="confirmPass" placeholder="Confirm Password" required
                                   value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <input className="accountBtn" type="submit" value="Update"/>
                    </div>
                </form>
                <form className="account_form" onSubmit={updatePassword}>
                    <div className="form_row">
                        <span className="section_label">
                            Password
                        </span>
                        <div className="form_element">
                            <input className="form_input_element" type="password" name="confirmPassword" placeholder="Confirm Current Password" required
                                   value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_element form_margin">
                            <input className="form_input_element" type="password" name="updatedPassword" placeholder="Enter New Password" required
                                   value={updatedPassword} onChange={(e) => setUpdatedPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="form_element form_margin">
                            <input className="form_input_element" type="password" name="confirmUpdatedPassword" placeholder="Confirm New Password" required
                                   value={confirmUpdatedPassword} onChange={(e) => setConfirmUpdatedPassword(e.target.value)} />
                        </div>
                        <input className="accountBtn" type="submit" value="Update"/>
                    </div>
                </form>
                <div className="update_message">
                    {message}
                </div>
                <Link className="help_link" to="/contact">
                    Can't Find What You Need? Contact Us Here
                </Link>
            </div>
        </div>
    )
}

export default AccountForms;