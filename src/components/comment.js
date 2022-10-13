import React from 'react';
import {useRef} from 'react';

import docModel from '../models/document';

//Function to return div with boxes displaying all values in documents.
const Comments = ({Content, Element, CommentArray, setComments, user})=> {
    const Comment = useRef("");
    const Contents = useRef("");
    const Line = useRef("");
    const Lines = useRef("");
    let liner = "";
    try {
        liner = document.getElementById(Element).innerHTML.slice(17, -6);
        Lines.current = liner.replace("</div><div>", "<br>").split(/<br>|\n/);
    } catch {
        liner = "";
    }

    function commentHandler(event) {
        Comment.current = event.target.value;
    };

    function LineHandler(event) {
        if (Lines.current.indexOf(event.target.value) === -1) {
            Line.current = 1;
            Contents.current = Lines.current[Line.current - 1].replace('&nbsp;', '');
        } else {
            Line.current = Lines.current.indexOf(event.target.value) + 1;
            Contents.current = Lines.current[Line.current - 1].replace('&nbsp;', '');
        }
    };

    async function SendComment() {
        if (Content.id === "choose" | Content.id === 0 | Content.id === "") {
            alert("Enter title, text and create document, then save comments.")
        } else if (typeof Line.current !== 'number' | typeof Comment.current !== 'string') {
                alert("Choose line and write comment before saving")
        } else {
            await docModel.addComment(Content.id, Line.current, Comment.current, Contents.current);
            console.log(Content)
            docModel.getDocument(Content.id, user).then(function(result){
                setComments(result.comments);
            });
            alert("Document successfully commented")
        }
    }

    return (
        <div className='commentsection'>
            <h2>Comments</h2>
            <div className="comment">
                <label for="comment">  Line: </label>
                <select id="line" onChange={(event) => {
                    LineHandler(event)
                }} name="line">
                <option value="line"> -- select line -- </option>
                {Array.isArray(Lines.current)
                ? Lines.current.map(document => {
                    return <option value={document} onClick>{document.replace('&nbsp;', '')}</option>;
                })
                : null}
                </select>
                <label for="comment">  Comment: </label>
                <input type="comment" name="comment" id="comment" onChange={commentHandler} />

                <button onClick={SendComment}>Save comment</button>
            </div>

            <table className='table'>
                <tr>
                <th>Line:</th>
                <th>Comment:</th>
                <th>Content on line:</th>
                </tr>
                {Array.isArray(CommentArray)
                    ? CommentArray.map(comment => {
                        return (
                        <tr>
                        <td>{comment.line}</td>
                        <td>{comment.comment}</td>
                        <td>{comment.content}</td>
                    </tr>)
                    })
                    : null}
            </table>
        </div>
    );
};

export default Comments;
