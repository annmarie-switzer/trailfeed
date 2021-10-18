import React from 'react';
import { search } from 'api';
import SearchIcon from 'static/icons/SearchIcon';

function SearchBar(props) {
    const submit = async (key) => {
        if (key === 'Enter') {
            console.log('submit');
            props.searchRes(await search());
        }
    } 

    return (
        <div id="searchbar">
            <span className="icon">
                <SearchIcon width={20} height={20} />
            </span>
            <input type="search" placeholder="Search" onKeyDown={(e) => submit(e.key)} />
        </div>
    )
}

export default SearchBar;