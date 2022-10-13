import React from 'react';
import {useRef} from 'react';

import mailModel from '../models/mail';

//Function to mail data in backend. Checks data and if correct sends data to mail model.
export default function Mail({code, title}) {
    const email = useRef("");
    const sender = useRef("");
    if (code === 0) {
        code = "Create document first.";
        title = "No document created."
    }

    function emailHandler(event) {
        email.current = event.target.value;
    }

    function nameHandler(event) {
        sender.current = event.target.value;
    }

    async function mailContent() {
        if (code === 0 || email.current === "" || sender.current === "") {
            alert("Enter correct data to send email")
        } else {
            await mailModel.mailer(code, JSON.stringify(title), sender.current, email.current);
            alert(`Email is now sent to email adress: ${email.current}, to edit document "${title}".`)
        }
    }

    return (
        <>
        <div>
            <h2>Send an email invitation to edit your document</h2>
            <label for="dokumentkod">   Document code: </label>
            <input type="code" name="dokumentkod" id="dokumentkod" value={code} readonly></input>
            <label for="titel"> Title: </label>
            <input type="title" name="titel" id="titel" value={title} readonly></input>
            <label for="email"> Recipient's email: </label>
            <input type="email" name="email" id="email" onChange={emailHandler} />
            <label for="namn">  Your name: </label>
            <input type="sender" name="namn" id="namn" onChange={nameHandler} />

            <button onClick={mailContent}>Skicka mail</button>
        </div>
        </>
    );
}
