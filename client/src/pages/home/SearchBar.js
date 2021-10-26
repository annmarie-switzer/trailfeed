import React, { useContext, useState } from 'react';
import { search } from 'api';
import SearchIcon from 'static/icons/SearchIcon';
import SlidersIcon from 'static/icons/SlidersIcon';
import { AppContext } from 'shared/App';

function SearchBar(props) {
    const user = useContext(AppContext);
    const [open, setOpen] = useState(false);

    const submit = async (event) => {
        if (event.key === 'Enter') {
            const query = {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "match_bool_prefix": {
                                    "name": event.target.value
                                }
                            },
                            {
                                "match_bool_prefix": {
                                    "brand": event.target.value
                                }
                            },
                            {
                                "match_bool_prefix": {
                                    "ingredients": event.target.value
                                }
                            }
                        ]
                    }
                },
                "post_filter": {
                    "bool": {
                        "should": [
                            {
                                "term": {
                                    "user.keyword": user.email
                                }
                            },
                            {
                                "bool": {
                                    "must_not": {
                                        "exists": {
                                            "field": "user"
                                        }
                                    }
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
        <div id="search-container">
            <div className="searchbar">
                <span className="icon">
                    <SearchIcon width={20} height={20} />
                </span>
                <span className="icon" onClick={() => setOpen(!open)}>
                    <SlidersIcon
                        width={20}
                        height={20}
                        stroke={open ? 'var(--primary)' : 'var(--fg)'} />
                </span>
                <input
                    type="text"
                    placeholder="Search"
                    className={open ? 'open' : ''}
                    onKeyDown={submit} />
            </div>
            <div className={open ? 'filters open' : 'filters'}>
                <div className="filters-content">
                    Hello I am some filters.
                </div>
            </div>
        </div>
    )
}

export default SearchBar;