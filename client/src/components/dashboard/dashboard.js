import React, { useEffect, useState } from "react";
import {ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent, SidebarFooter} from "react-pro-sidebar";
import {useHistory} from "react-router-dom";

import "../../css/dashboard/dashboard.css";
import "../../css/dashboard/reactprosidebar_custom.scss";

import conf from "../../resources/phone-call.png";
import user from "../../resources/user.png";
import conf_history from "../../resources/history.png";
import toggle from "../../resources/toggle.png";
import logout_icon from "../../resources/logout.png";

import Logo from "../home/logo";
import Icon from "./icon";
import CreateRoomForms from "./create_room_forms";
import HistoryTable from "./history_table";
import AccountForms from "./account_forms";


const Dashboard = () => {
    let history = useHistory();
    const [userData, setUser] = useState({});
    const [collapsed, toggleNavbar] = useState(false);
    const [navPage, setNavPage] = useState("createRoom");

    useEffect(() => {
        const fetchData = () => {
            const url = "/api/getUserData";
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
                setUser(data)
            }).catch(err => {
                console.log(err)
            })
        }

        fetchData();
    }, [history])

    const gotoCreateRoom = () => {
        setNavPage("createRoom")
    }

    const gotoHistory = () => {
        setNavPage("history")
    }

    const gotoAccount = () => {
        setNavPage("account")
    }

    const toggleNavBar = () => {
        toggleNavbar(!collapsed)
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
            <ProSidebar collapsed={collapsed}>
                <SidebarHeader className="dashboard_header">
                    <Logo className={"dashboard_logo"} style_title={{display: "none"}}
                          style_logo={{width: "45px", height: "auto"}}/>
                </SidebarHeader>
                <SidebarContent>
                    <Menu>
                        <div className="menu_highlight_background" onClick={gotoCreateRoom}>
                            <MenuItem icon={<Icon
                                url={conf}
                                alt={"createroom"}
                                className={"menu_icon_background"}
                                iconClass={"menu_item_icon1"}
                            />}>
                                Create Room
                            </MenuItem>
                        </div>
                        <div className="menu_highlight_background" onClick={gotoHistory}>
                            <MenuItem icon={<Icon
                                url={conf_history}
                                alt={"roomhistory"}
                                className={"menu_icon_background"}
                                iconClass={"menu_item_icon2"}
                            />}>
                                Room History
                            </MenuItem>
                        </div>
                        <div className="menu_highlight_background" onClick={gotoAccount}>
                            <MenuItem icon={<Icon
                                url={user}
                                alt={"account"}
                                className={"menu_icon_background"}
                                iconClass={"menu_item_icon1"}
                            />}
                            >Account</MenuItem>
                        </div>
                        <div className="menu_highlight_background" onClick={toggleNavBar}>
                            <MenuItem icon={<Icon
                                url={toggle}
                                alt={"toggle"}
                                className={"menu_icon_background"}
                                iconClass={"menu_item_icon1"}
                            />}
                            >Toggle Menu</MenuItem>
                        </div>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <Menu>
                        <div className="logout_highlight_background" onClick={logout}>
                            <MenuItem icon={<Icon
                                url={logout_icon}
                                alt={"menuItem"}
                                className={"menu_icon_background"}
                                iconClass={"menu_item_icon3"}
                                onOpenChange={toggleNavBar}
                            />}>Logout</MenuItem>
                        </div>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
            { navPage === "createRoom" ? <CreateRoomForms userData={userData}/> : null}
            { navPage === "history" ? <HistoryTable/>: null}
            { navPage === "account" ? <AccountForms/>: null}
        </div>
    )
}

export default Dashboard;