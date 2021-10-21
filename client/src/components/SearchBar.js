import React from 'react';
import { search } from 'api';
import SearchIcon from 'static/icons/SearchIcon';

function SearchBar(props) {
    const submit = async (event) => {
        if (event.key === 'Enter') {
            const query = {
                "query": {
                    "match_bool_prefix": {
                        "name": `${event.target.value}`
                    }
                }
            }

            const res = await search(query);
            props.searchRes(res);
        }
    }

    return (
        <div id="searchbar">
            <span className="icon">
                <SearchIcon width={20} height={20} />
            </span>
            <input
                type="search"
                placeholder="Search"
                onKeyDown={submit} />
        </div>
    )
}

export default SearchBar;