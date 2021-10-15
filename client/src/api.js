export const getUser = async () => {
    const res = await fetch('http://localhost:5000/user', {
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error(res.statusText)
    } else {
        return await res.json();
    }
}

export const logout = async () => {
    const res = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include'
    });
    
    if (!res.ok) {
        throw new Error(res.statusText)
    } else {
        window.location.href = '/';
    }
}

export const search = async () => {
    const res = await fetch('http://localhost:5000/search', {
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error(res.statusText)
    } else {
        return await res.json();
    }
}