export const getUser = async () => {
    const res = await fetch('http://localhost:5000/user', {
        credentials: 'include'
    });

    return await res.json();
}

export const logout = async () => {
    await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include'
    });
    
    window.location.href = '/';
}

export const search = async (req) => {
    const res = await fetch('http://localhost:5000/search', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(req),
        headers: {'Content-Type': 'application/json'}
    });

    return await res.json();
}

export const updateRating = async (req) => {
    const res = await fetch('http://localhost:5000/update-rating', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(req),
        headers: {'Content-Type': 'application/json'}
    });

    return await res.json();
}

export const newDoc = async (req) => {
    const res = await fetch('http://localhost:5000/new-doc', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(req),
        headers: {'Content-Type': 'application/json'}
    });

    return await res.json();
}
