import './App.css';
import React from 'react';
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from 'react';
import "trix";
import "trix/dist/trix.css";

import orderModel from "./models/document";

import Login from './components/login';
import Accesser from './components/access';
import DownloadContent from './components/download';
import MailContent from './components/mail';
import AllDocs from './components/alldocs';
import Logout from './components/logout';
import Comments from './components/comment';

let sendToSocket = false;

function changeSendToSocket(value) {
  sendToSocket = value;
}

function App() {
  const [content, setContent] = useState({id: 0, name:"", content:"Write your text here..."});
  const [title, setTitle] = useState("Write your title here...");
  const [documents, setDocuments] = useState("");
  const [comments, setComments] = useState("");
  const [value, setValue] = useState("choose");
  const [token, setToken] = useState("");
  const [user, setUserId] = useState("");
  const [socket, setSocket] = useState(null);
  let setter = true;
  const newValue = useRef("");
  const newContent = useRef("");

//Update and set documents as initial stage.
  useEffect(() => {
    reloadOrders(token);
}, [token]);

  async function reloadOrders(token) {
    setDocuments(await orderModel.getDocuments(token));
  }

//Sockets when specific file is changed update if selected, live update. And if changed here change there.
useEffect(() => {
  console.log(sendToSocket);
  if (socket && sendToSocket) {
    console.log("uppdaterar socket")
    try {
      socket.emit("content", {id: value, name: title, content: document.getElementById("trix-content").firstChild.innerHTML.slice(12)});
    } catch {
      socket.emit("content", {id: value, name: title, content: document.getElementById("trix-content").firstChild.innerHTML});
    }
  }

  changeSendToSocket(true);
  console.log(sendToSocket);

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [content]);

useEffect(() => {
  setSocket(io("https://jsramverk-editor-anbj21.azurewebsites.net/"));

      return () => {
        if (socket) {
          socket.disconnect();
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    if (socket) {
      socket.on("content", function (data) {
        changeSendToSocket(false);
        console.log("Updates from socket");
        setTrixContent(data, false);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

//Funkction to set data if socket returns with updated data.
function setTrixContent(data) {
  if (newValue.current === data.id) {
    console.log("live")
    let element = document.querySelector("trix-editor")
    setContent(content => ({...content, ...data}));
    newContent.current =  data.content;
    document.getElementById("trix-content").innerHTML = data.content;
    var len = element.innerHTML.length;
    var t = element.innerHTML.createTextRange();
    t.moveEnd('character', len);
  }
  setter = false;
}

//Function to add new document to API. Depending on value from trix-editor and on function saveMessage to set data.
async function handleMessage() {
  try {
    await saveMessage(document.getElementById("trix-content").firstChild.innerHTML.slice(12));
  } catch {
    return "";
  }
};

//HandleMessage() is depending on saveMessage. Set content and add new document to API. Documents is updated set set new data to useState.
async function saveMessage(message) {
  newContent.current =  message;
  await orderModel.addDocument(title, message, user).then(function(result) {
    console.log(result)
    console.log(result._id)
    setContent(content => ({...content, ...{id: result._id, name: result.name, content: result.content}}));
    reloadOrders(token);
  });
};

//Function to set content with current value and update document values in API.
  async function handleUpdate() {
    try {
      newContent.current =   document.getElementById("trix-content").firstChild.innerHTML.slice(12);
      setContent(content => ({...content, ...{id: value, name: title, content: document.getElementById("trix-content").firstChild.innerHTML.slice(12)}}));
      await orderModel.updateDocument(content);
    } catch {
      return "";
    }
  };

  //Function to update current chosen document. If new document is choosen onChange calls handle message. Set values if user has access to edit document. If in access list on specific document.
  async function handleChange(event) {
    orderModel.getDocument(event.target.value, user).then(function(result){
      if (result === "Access denied.") {
        alert("You do not have access too this document")
        valuer("choose");
        setValue("choose");
        setTitle("Write your title here...");
        setComments({})
        setContent(content => ({...content, ...{id: 0, name: "", content: "Write your text here..."}}));
        newContent.current = "Write your title here...";
        document.getElementById("trix-content").innerHTML = "Write your text here...";
        document.getElementById("changer").value = "choose";
      } else {
        valuer(result._id);
        setValue(result._id);
        setTitle(result.name);
        setComments(result.comments);
        newContent.current = result.content;
        setContent(content => ({...content, ...{id: result._id, name: result.name, content: result.content}}));
        document.getElementById("trix-content").innerHTML = result.content;
      }
      });
  };

//If button "Reset editor" is clicked set values.
  async function resetter() {
        valuer("choose");
        setValue("choose");
        setTitle("Write your title here...");
        setComments({})
        newContent.current = "Write your title here...";
        setContent(content => ({...content, ...{id: 0, name: "", content: "Write your text here..."}}));
        document.getElementById("trix-content").innerHTML = "Write your text here...";
        document.getElementById("changer").value = "choose";
  };

//Function to set value.
  function valuer(value) {
    if (value === "Write your text here...") {
      let currentValue = value;
      return currentValue;
    } else {
      return value;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          JSRAMVERK
        </p>
      </header>
      <div>
        <h1>Annas Editor</h1>
      </div>
      <div className="main">
        {token ?
          <>
          <div>
          <Logout/>
        <label className='lefter'>
          <h2 className='spacer'>Do you want to update already existing document?</h2>
          <select value={value.value} id="changer" onChange={(event) => {
            handleChange(event).then(function(result) {
              setValue(event.target.value);
            })
          }} name="choose">
            <option value="choose"> -- select an option -- </option>
            {Array.isArray(documents)
            ? documents.map(document => {
                return <option value={document._id} onClick>{document.name}</option>;
              })
            : null}
            </select>
        </label>
        <h4><br /> ...otherwise create a new document by title and text below. <br /></h4>
        <input
          id="title-trix"
          name="title-trix"
          onChange={(event) => {setTitle(event.target.value)}}
          value={title}
        />
        </div>
        <div id="trixer">
          <trix-editor id="trix-content" onInput={(event) => {
            if (setter === true) {
              const inEditor = event.target.value.slice(5, -6);
              newContent.current =  inEditor;
              setContent(content => ({...content, ...{id: value, name: title, content: inEditor}}));
              setter = false;
            }}}/>
        </div>
        <DownloadContent FileName={title} Element={"trix-content"}/>
        <div>
        {(() => {
              if (value !== "choose") {
                return (
                  <button className='update' onClick={() => handleUpdate()}>Update</button>
                )
              } else {
                return (
                  <button className='create' onClick={() => handleMessage()}>Create</button>
                )
              }
          })()}
          <button onClick={() => resetter()}>Reset editor</button>
        </div>
          <Comments Content={content} Element={"trix-content"} CommentArray={comments} setComments={setComments} user={user}/>
          <div className='left'>
            <Accesser userId={user}/>
            <MailContent code={content.id} title={content.name}/>
          </div>
          <AllDocs documents={documents} />
          </>
          :
          <Login setToken={setToken} setUserId={setUserId} />
        }
      </div>
    </div>
  );
}

export default App;
