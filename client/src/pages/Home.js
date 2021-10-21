import SearchBar from 'components/SearchBar';
import React, { useState } from 'react';

function Home() {
    const [res, setRes] = useState();

    const handleRes = (res) => {
        const hits = res.hits.hits.map(h => h._source);
        setRes(hits)
    };

    return (
        <div id="home">
            <SearchBar searchRes={handleRes}/>
            <div id="cards">
                <pre>{JSON.stringify(res, null, 2)}</pre>
            </div>
        </div>
    )
}

export default Home;