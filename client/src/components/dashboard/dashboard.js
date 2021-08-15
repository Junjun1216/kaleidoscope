import "../../css/dashboard/dashboard.css";
import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";

const Dashboard = () => {
    let history = useHistory();
    const [userData, setUser] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const url = "/dashboard";
            const options = {
                headers : {
                    'Accept': 'application/json'
                },
                credentials: "include"
            };

            await fetch(url, options).then(res => {
                return res.json()
            }).then(data => {
                console.log(data)
                setUser(data)
            }).catch(err => {
                console.log(err)
            })
        }

        fetchData();
    }, [])

    const logout = () => {
        const url = "/logout";
        const options = {
            headers : {
                'Accept': 'application/json'
            },
            credentials: "include"
        };
        fetch(url, options)
            .then(res => {
                if (res.status === 200) {
                    history.push("login")
                }
            });
    }

    return (
        <div className="dashboard">
            <div>
                Welcome {userData.user}
            </div>
            <input className="logout_btn" type="button" value="Logout" onClick={logout}/>
        </div>
    )
}

export default Dashboard;