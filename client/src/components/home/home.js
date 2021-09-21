import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
// import { useOnScreen } from '@schibstedspain/sui-react-hooks';

import Login from "./login_forms";
import HomeFooter from "./home_footer";
import Register from "./register_forms";
import RegisterRedirect from "./register_redirect";
import Main from "./main";
import AboutPage from "./about_page";
import ContactPage from "./contact_page";
import PhantomFooter from "../../css/home/phantom_footer";

import useOnScreen from "../hook/useOnScreen";
import "../../css/home/home.css";

const Home = () => {
    let history = useHistory();
    const [raiseUnauthorized, setUnauth]= useState(false);
    const aboutRef = useRef(null);
    const contactRef = useRef(null);
    const phantomFooterRef = useRef(null);
    const footerRef = useRef(null);

    const navTo = (to) => {
        if (to === "about") {
            window.scrollTo({
                top: aboutRef.current.getBoundingClientRect().height + footerRef.current.clientHeight + 1,
                left: 0,
                behavior: 'smooth'
            })
        } else if (to === "contact") {
            window.scrollTo({
                top: contactRef.current.getBoundingClientRect().height*2 + footerRef.current.clientHeight + 1,
                left: 0,
                behavior: 'smooth'
            })
        }
    }

    const goHomeNavTo = async (to) => {
        if (to === "about") {
            await history.push("/home");
            window.scrollTo({
                top: aboutRef.current.getBoundingClientRect().height + footerRef.current.clientHeight + 1,
                left: 0,
                behavior: 'smooth'
            })
        } else if (to === "contact") {
            await history.push("/home");
            window.scrollTo({
                top: contactRef.current.getBoundingClientRect().height*2 + footerRef.current.clientHeight + 1,
                left: 0,
                behavior: 'smooth'
            })
        }
    }

    const loginUser = async (login) => {
        const url = "/api/login";
        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            },
            credentials: "include",
            redirect: "follow",
            body: JSON.stringify({
                username: login.usernameText,
                password: login.passwordText
            })
        };

        await fetch(url, options)
            .then(res => {
                if (res.status === 200) {
                    history.push("/dashboard");
                    setUnauth(false);
                } else {
                    history.push("/login");
                    setUnauth(true);
                }
            });
    }

    const registerUser = async (register) => {
        const url = "/api/register";
        const options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            },
            redirect: "follow",
            body: JSON.stringify({
                email: register.emailText,
                username: register.usernameText,
                password: register.passwordText
            })
        };

        await fetch(url, options)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    history.push({
                        pathname: "/redirect",
                        state: {
                            isSuccessful: true,
                            message: "Registered Successfully"
                        },
                    });
                } else {
                    history.push({
                        pathname: "/redirect",
                        state: {
                            isSuccessful: false,
                            message: "An Error Has Occurred:" + res.status
                        },
                    });
                }
            });
    }

    return (
        <div className="home">
            <Switch>
                <Route exact path="/login">
                    <Login raiseUnauthorized={raiseUnauthorized} loginUser={loginUser}/>
                    <HomeFooter navTo={goHomeNavTo}/>
                </Route>
                <Route exact path="/register">
                    <Register registerUser={registerUser}/>
                    <HomeFooter navTo={goHomeNavTo}/>
                </Route>
                <Route exact path="/redirect">
                    <RegisterRedirect isSuccessful={true} message={"Registered"}/>
                    <HomeFooter navTo={goHomeNavTo}/>
                </Route>
                <Route path="/home">
                    <Main navTo={navTo} footerRef={footerRef} phantomFooterRef={phantomFooterRef}/>
                    <PhantomFooter phantomFooterRef={phantomFooterRef}/>
                    <HomeFooter navTo={navTo} footerRef={footerRef}/>
                    <AboutPage aboutRef={aboutRef}/>
                    <ContactPage contactRef={contactRef}/>
                </Route>
                <Redirect from="/*" exact to="/home"/>
            </Switch>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
                  integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
                  crossOrigin="anonymous"/>
        </div>
    )
}

export default Home;