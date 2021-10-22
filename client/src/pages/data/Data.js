import { search } from 'api';
import React, { useState } from 'react';

function Data() {
    const [data, setData] = useState(null);

    const getData = async () => {
        const res = await search();
        setData(res);
    }

    return (
        <div id="data">
            <button type="button" onClick={getData}>Search</button>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default Data;