import React from 'react';
import { search } from 'api';
import SearchIcon from 'static/icons/SearchIcon';
import SlidersIcon from 'static/icons/SlidersIcon';

function SearchBar(props) {
    const submit = async (event) => {
        if (event.key === 'Enter') {
            const query = {
                query: {
                    bool: {
                        should: [
                            {
                                match_bool_prefix: {
                                    name: `${event.target.value}`
                                }
                            },
                            {
                                match_bool_prefix: {
                                    brand: `${event.target.value}`
                                }
                            }

                        ]
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
            <span className="icon" onClick={() => props.toggleDrawer()}>
                <SlidersIcon
                    width={20}
                    height={20}
                    stroke={props.drawerOpen ? 'var(--primary)' : 'var(--fg)'} />
            </span>
            <input
                type="search"
                placeholder="Search"
                onKeyDown={submit} />
        </div>
    )
}

export default SearchBar;