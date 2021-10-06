import React, { useState } from 'react';

function Data() {
    const [data, setData] = useState(null);

    const getData = async () => {
        const res = await fetch('http://localhost:5000/data', { credentials: 'include' });
        setData(await res.json());
    }

    return (
        <div id="data">
            <button type="button" onClick={getData}>Data</button>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default Data;