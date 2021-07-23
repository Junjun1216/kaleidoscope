import React, { useState } from 'react';
import Login from './components/login_forms';
import Register from './components/register_forms';
import CustomField from './components/custom_field';
import HomeFooter from "./components/home_footer";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.css";

const App = () => {

    const submitForms = async (login) => {
        console.log(login)
    }

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/login">
                        <Login submitForms={submitForms}/>
                        <HomeFooter/>
                    </Route>
                    <Route path="/Register">
                        <Register submitForms={submitForms}/>
                    </Route>
                    <Route path="/">
                        <CustomField/>
                    </Route>
                </Switch>
            </div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
                  integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
                  crossOrigin="anonymous"/>
        </Router>
    );
}

export default App;
