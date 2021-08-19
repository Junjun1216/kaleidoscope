import React, { useEffect, useState } from "react";
import {ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent, SidebarFooter, SubMenu} from "react-pro-sidebar";
import {useHistory} from "react-router-dom";
import {v1 as uuid} from "uuid";
import Logo from "../home/logo";
import Icon from "./icon";

import "../../css/dashboard/dashboard.css";
import "../../css/dashboard/reactprosidebar_custom.scss";

import conf from "../../resources/phone-call.png";
import user from "../../resources/user.png";
import conf_history from "../../resources/history.png";
import toggle from "../../resources/toggle.png";
import logout_icon from "../../resources/logout.png";


const Dashboard = (props) => {
    let history = useHistory();
    const [userData, setUser] = useState({user:"bop"});
    const [navBar, toggleNavbar] = useState(false);

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

    const createRoom = () => {
        const id = uuid();
        const win = window.open(`/room/${id}`, "_blank");
        win.focus();
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

    const toggleNavBar = () => {
        toggleNavbar(!navBar)
    }

    return (
        <div className="dashboard">
            <ProSidebar collapsed={navBar}>
                <SidebarHeader className="dashboardHeader">
                    <Logo className={"dashboardLogo"} style_title={{display: "none"}}
                          style_logo={{width: "45px", height: "auto"}}/>
                </SidebarHeader>
                <SidebarContent>
                    <Menu>
                        <div onClick={createRoom}>
                            <MenuItem icon={<Icon
                                url={conf}
                                alt={"createroom"}
                                className={"menuIconBackground"}
                                iconClass={"menuItemLogo1"}
                            />}>
                                Create Room
                            </MenuItem>
                        </div>
                        <div>
                            <MenuItem icon={<Icon
                                url={conf_history}
                                alt={"roomhistory"}
                                className={"menuIconBackground"}
                                iconClass={"menuItemLogo2"}
                            />}>
                                Room History
                            </MenuItem>
                        </div>
                        <div>
                            <MenuItem icon={<Icon
                                url={user}
                                alt={"account"}
                                className={"menuIconBackground"}
                                iconClass={"menuItemLogo1"}
                                onOpenChange={toggleNavBar}
                            />}
                            >Account</MenuItem>
                        </div>
                        <div onClick={toggleNavBar}>
                            <MenuItem icon={<Icon
                                url={toggle}
                                alt={"toggle"}
                                className={"menuIconBackground"}
                                iconClass={"menuItemLogo1"}
                                onOpenChange={toggleNavBar}
                            />}
                            >Toggle Menu</MenuItem>
                        </div>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <Menu>
                        <div onClick={logout}>
                            <MenuItem icon={<Icon
                                url={logout_icon}
                                alt={"menuItem"}
                                className={"menuIconBackground"}
                                iconClass={"menuItemLogo3"}
                                onOpenChange={toggleNavBar}
                            />}>Logout</MenuItem>
                        </div>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
            Welcome {userData.user}
        </div>

        // <div className="dashboard">
        //     <div>
        //         Welcome {userData.user}
        //     </div>
        //     <button onClick={create}>Create room</button>
        //     <input className="logout_btn" type="button" value="Logout" onClick={logout}/>
        // </div>
    )
}

export default Dashboard;