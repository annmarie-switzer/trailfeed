import React, { useState } from 'react';
import { search } from 'api';
import SearchIcon from 'static/icons/SearchIcon';
import SlidersIcon from 'static/icons/SlidersIcon';
import Modal from './Modal';

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

    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <div id="container">
            <div id="searchbar">
                <span className="icon">
                    <SearchIcon width={20} height={20} />
                </span>
                <span className="icon" onClick={() => setFiltersOpen(!filtersOpen)}>
                    <SlidersIcon
                        width={20}
                        height={20}
                        stroke={filtersOpen ? 'var(--primary)' : 'var(--fg)'} />
                </span>
                <input
                    type="search"
                    placeholder="Search"
                    onKeyDown={submit} />
            </div>
            <div id="filters">
                <div className="filter">
                    
                </div>
            </div>

            {!filtersOpen ? null : 
                <Modal close={() => setFiltersOpen(false)} />
            }
        </div>
    )
}

export default SearchBar;