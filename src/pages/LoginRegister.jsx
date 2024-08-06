// Functions for login/register page defined here
// CSS data stored in App.css

import React from "react";
import { useState } from "react";

// API URL
const API_URL = `http://4.237.58.241:3000`;

// Messages to be shown at various times. 
const invalidEmail = 'Invalid email. it must include an @ symbol that is preceded and succeeded by at least one character. It must also contain a dot.';
const accountCreated = "Account created successfully!";
const loggedIn = "You have successfully logged in. You may now access exclusive content!";
const serverFail = "It looks like the server timed out or is currently unavailable. Please try again later";

export default function LoginRegisterPage() {
  // setup email and password fields
  const [loginData, setLoginData] = useState({
    emailInput: '',
    passwordInput: ''
  });
  const [showPassword, setShowPassword] = useState(false);  // state to handle show password button
  const [feedbackSection, setFeedbackSection] = useState(false); // state to handle any messages to be shown to the users
  const [mode, setMode] = useState("login");  // state to handle if user will be registering or loggin in

  // method to handle if user wants to toggle between logging in or registering
  const toggleLoginMode = () => {
    if (mode === "login") {
      setMode("register");
    } else {
      setMode("login")
    }
  }

  // method to handle if user wants to see the password they've typed in
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // method to handle when user enters data into fields
  const handleInputChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value
    });
  };

  // method to handle on press of submit button
  const handleSubmit = (event) => {
    event.preventDefault();
    handleInput();
  }

  // method to handle user input of email. There are criteria to ensure that user actually enters a valid email.
  const handleInput = () => {
    const emailCriteria = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if email deemed invalid, then it will show invalid email error
    if (!emailCriteria.test(loginData.emailInput)) {
      setFeedbackSection(invalidEmail);
    }
    // send data to server. Mode is dependent on if user is trying to log in or register. 
    else {
      sendAndProcessData(mode);
    }
  }

  // main function used to send and receive data from server.
  // mode used to determine if user is trying to login or not
  const sendAndProcessData = (mode) => {
    const url = `${API_URL}/user/${mode}`;

    // use fetch with post method to send login or register data to server
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: loginData.emailInput, password: loginData.passwordInput }),
    })
      .then((res) => {
        // check if response is okay. 
        // If not okay, then set feedback section to show the returned error message
        // Exit method if error has occured
        if (!res.ok) {
          res.json().then((errorData) => {
            setFeedbackSection(errorData.message);
          });
          return null;
        }
        else {
          return res.json();
        }
      })
      // check if response is null or undefined
      .then((res) => {
        if (res === null || res === undefined) {
          return;
        }
        // this message is returned if user was tyring to login
        // shows user the message informing them that the account was successfully created
        // immediately change to login mode
        if (res.message === "User created") {
          setFeedbackSection(accountCreated);
          toggleLoginMode();
        }
        // if user was trying to login, then it will save token for session usage
        // displays message showing that the user successfully logged in
        else {
          sessionStorage.setItem("token", res.token);
          setFeedbackSection(loggedIn);
        }
      })
      // catch any errors and tell user that the server has failed
      .catch((error) => {
        console.log(error);
        setFeedbackSection(serverFail);
      })
  };

  return (
    <div className="container">
      {/*Main login or register form*/}
      <div className="form">
        {/*Display login or register text based on mode selected by user*/}
      <h1>{mode.charAt(0).toUpperCase() + mode.slice(1)}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email:<br />
            {/*Format input field for email*/}
            <input
              type="text"
              name="emailInput"
              value={loginData.inputValue1}
              onChange={handleInputChange}
              placeholder="e.g. mike@gmail.com"
            />
          </label>
          <br />
          <label>
            Password:<br />
            {/*Format input field for password*/}
            <input
              type={showPassword ? 'text' : 'password'}
              name="passwordInput"
              value={loginData.inputValue2}
              onChange={handleInputChange}
            />
          </label>
          {/*Button to toggle showing password*/}
          <button type="button" onClick={handleTogglePassword}>
            {showPassword ? 'Hide' : 'Show'} Password
          </button>
          <br />
          {/*section showing error or other feedback messages for user*/}
          {feedbackSection && <div>{feedbackSection}</div>}
          <br />
          {/*submit button*/}
          <button type="submit">Submit</button>
          <br />
          {/*button to toggle if user wants to login or register*/}
          <button type="button" onClick={toggleLoginMode}>
            Click here to {mode === 'login' ? 'register' : 'login'}
          </button>
        </form>
      </div>
    </div>
  );
}
