import { useState } from 'react';

import authModel from '../models/auth';

//Login function to register new user and login if user is found and set value token when logged in.
export default function Login({setToken, setUserId}) {
    const [user, setUser] = useState({});

    function changeHandler(event) {
        let newObject = {};

        newObject[event.target.name] = event.target.value;

        setUser({...user, ...newObject});
    }

    async function register() {
        await authModel.register(user).then(function(result){
            alert("User successfully created, please login.")
        });
    }

    async function login() {
        const loginResult = await authModel.login(user);

        if (loginResult.data.token) {
            setToken(loginResult.data.token);
            setUserId(loginResult.data._id);
            alert("User logged in. Click OK to continue.")
        } else {
            alert("No user found with this data. Check if email and password are correct.")
        }
    }

    return (
        <>
            <h2>Login eller registrera</h2>
            <label>Email: </label>
            <input type="email" name="email" onChange={changeHandler} />
            <label> Password: </label>
            <input type="password" name="password" onChange={changeHandler} />
            <div className='login-buttons'>
                <button onClick={register}>Registrera</button>
                <button onClick={login}>Logga in</button>
            </div>
        </>
    );
}