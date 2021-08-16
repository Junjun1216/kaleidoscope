import "../../css/dashboard/dashboard.css";
import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";
import {v1 as uuid} from "uuid";

const Dashboard = (props) => {
    let history = useHistory();
    const [userData, setUser] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const url = "/api/dashboard";
            const options = {
                headers : {
                    'Accept': 'application/json'
                },
                credentials: "include"
            };

            await fetch(url, options).then(res => {
                if (res.status === 200) {
                    return res.json()
                }
                history.push("/login");
            }).then(data => {
                setUser(data)
            }).catch(err => {
                console.log(err)
            })
        }

        fetchData();
    }, [])

    const create = () => {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    const logout = () => {
        const url = "/api/logout";
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
            <button onClick={create}>Create room</button>
            <input className="logout_btn" type="button" value="Logout" onClick={logout}/>
        </div>
    )
}

export default Dashboard;