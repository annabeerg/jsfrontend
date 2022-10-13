import React from 'react';
import {jsPDF} from "jspdf";

//Download content from current document as pdf file to be able to print file.
const downloadContent = ({FileName, Element})=> {
    const downloadFileDocument = ()=> {
        if (FileName === "Write your title here...") {
            alert("Enter title and input before printing.")
        } else {
            const input = document.getElementById(Element).innerHTML.slice(17, -6);
            const pdf = new jsPDF("p", "pt", "a4");
            const value = '<div style="width:585px; height: 500px;"> <h3 style="text-align:center;">'+ FileName +'</h3><br><p>'+ input +'</p></div>';
            pdf.html(value, {
                callback: function(pdf) {
                    pdf.save(`${FileName}`);
                },
                x: 18,
                margin: [22, 18, 22, 18],
                maxWidth: 435,
                maxHeight: 400,
                pagesplit: true,
            });
        }
    }
    return (
        <div className='download-button'>
            <button className="download-content" onClick={downloadFileDocument}>Print document as PDF</button>
        </div>
    );
};

export default downloadContent;
