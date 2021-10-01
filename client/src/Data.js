import React, { useState } from 'react';

function Data() {
    const [data] = useState(null);

    const getData = async () => {
        const res = await fetch('http://localhost:5000/data', { credentials: 'include' });
        console.log(await res.json())
    }

    return (
        <div id="data">
            <button type="button" onClick={getData}>Data</button>
            <pre>{data}</pre>
        </div>
    )
}

export default Data;