export const getUser = async () => {
    const res = await fetch('/api/user', {
        credentials: 'include'
    });

    return await res.json();
}

export const logout = async () => {
    await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
    });
    
    window.location.href = '/';
}

export const search = async (req) => {
    const res = await fetch('/api/search', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(req),
        headers: {'Content-Type': 'application/json'}
    });

    return await res.json();
}

export const updateRating = async (req) => {
    const res = await fetch('/api/update-rating', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(req),
        headers: {'Content-Type': 'application/json'}
    });

    return await res.json();
}

export const addDoc = async (req) => {
    const res = await fetch('/api/add-doc', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(req),
        headers: {'Content-Type': 'application/json'}
    });

    return await res.json();
}
