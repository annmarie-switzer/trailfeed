import SearchBar from 'pages/home/SearchBar';
import React, { useState } from 'react';

function Home() {
    const [res, setRes] = useState();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleRes = (res) => {
        const hits = res.hits.hits.map(h => h._source);
        setRes(hits)
    };

    return (
        <div id="home">
            <SearchBar
                searchRes={handleRes}
                drawerOpen={drawerOpen}
                toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
            
            <div className="content">    
                <div id="cards">
                    <pre>{JSON.stringify(res, null, 2)}</pre>
                </div>
                <div className={drawerOpen ? 'drawer open' : 'drawer'}>
                    I should be dropped down from under the search bar instead
                </div>
            </div>
        </div>
    )
}

export default Home;