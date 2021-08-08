import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import React, {useState} from "react";
import Login from "./login_forms";
import HomeFooter from "./home_footer";
import Register from "./register_forms";
import RegisterRedirect from "./register_redirect";
import "../../css/home/home.css";

const Home = () => {
    let history = useHistory();
    const [raiseUnauthorized, setUnauth]= useState(false);

    const loginUser = async (login) => {
        const url = "http://localhost:3001/login";
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
                    window.location = "http://localhost:3000/dashboard";
                    setUnauth(false);
                } else {
                    history.push("/login");
                    setUnauth(true);
                }
            });
    }

    const registerUser = async (register) => {
        const url = "http://localhost:3001/register";
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
                        pathname: "/home/redirect",
                        state: {
                            isSuccessful: true,
                            message: "Registered Successfully"
                        },
                    });
                } else {
                    history.push({
                        pathname: "/home/redirect",
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
                <Route exact path="/home/login">
                    <Login raiseUnauthorized={raiseUnauthorized} loginUser={loginUser}/>
                    <HomeFooter/>
                </Route>
                <Route exact path="/home/register">
                    <Register registerUser={registerUser}/>
                    <HomeFooter/>
                </Route>
                <Route exact path="/home/redirect">
                    <RegisterRedirect isSuccessful={true} message={"Registered"}/>
                    <HomeFooter/>
                </Route>
                <Route path="/home">
                    <Register registerUser={registerUser}/>
                    <HomeFooter/>
                </Route>
                <Redirect from="/" exact to="/home"/>
            </Switch>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
                  integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
                  crossOrigin="anonymous"/>
        </div>
    )
}

export default Home;