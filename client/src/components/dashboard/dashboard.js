import "../../css/dashboard/dashboard.css";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [userData, setUser] = useState({});

    const fetchData = () => {
        const url = "http://localhost:3001/dashboard";
        const options = {
            headers : {
                'Accept': 'application/json'
            },
            credentials: "include"
        };
        fetch(url, options)
            .then(res => {
                res.json().then((data) => {
                    setUser(data);
                });
            });
    }

    useEffect(() => {
        fetchData();
    }, [])

    const logout = () => {
        const url = "http://localhost:3001/logout";
        const options = {
            headers : {
                'Accept': 'application/json'
            },
            credentials: "include"
        };
        fetch(url, options)
            .then(res => {
                if (res.status === 200) {
                    window.location = "http://localhost:3000/home/login";
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