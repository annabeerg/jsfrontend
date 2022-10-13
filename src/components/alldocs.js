import React from 'react';

//Function to return div with boxes displaying all values in documents.
const allDocs = ({documents})=> {
    return (
        <div className="boxes">
            {Array.isArray(documents)
            ? documents.map(document => {
                return <div className="allDocs">Title: { document.name } <br/> Text: { document.content } {"\n"}</div>
                })
            : null}
        </div>
    );
};

export default allDocs;
