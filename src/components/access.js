import { useState } from 'react';

import docModel from '../models/document';

//Add access to edit documents. Append value in API if code is found.
export default function Accesser({userId}) {
    const [user, setUser] = useState("");

    function changeHandler(event) {
        let newObject = {};

        newObject[event.target.name] = event.target.value;

        setUser({...user, ...newObject});
    }

    async function register() {
        await docModel.addAllowed(userId, user);
        alert("Access successfully added to user!")
    }

    return (
        <div>
            <h4>Add document code to extend your access too other documents</h4>
            <input type="code" name="code" onChange={changeHandler} />

            <button onClick={register}>Lägg till kod</button>
        </div>
    );
}