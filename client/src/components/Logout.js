import React from 'react';
// import { useHistory } from 'react-router';

function Logout() {
    // const history = useHistory();
    
    const logout = async () => {
        await fetch('http://localhost:5000/logout', {
            method: 'POST',
            credentials: 'include'
        });
        // history.push("/");
        window.location.href = '/';
    }

    return (
        <button type="button" onClick={logout}>Logout</button>
    )
}

export default Logout;