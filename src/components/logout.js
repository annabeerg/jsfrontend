import React from 'react';

//Function to logout user.
const logout = ()=> {
    function refreshPage() {
        window.location.reload(false);
    }
    return (
        <div>
            <button className='logout' onClick={() => refreshPage()}>Log out</button>
        </div>
    );
};

export default logout;
