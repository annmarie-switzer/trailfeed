export const getUser = async () => {
    const res = await fetch('http://localhost:5000/user', { credentials: 'include' });

    if (!res.ok) {
        throw new Error(res.statusText)
    } else {
        return await res.json();
    }
}

export const getData = async () => {
    const res = await fetch('http://localhost:5000/data', { credentials: 'include' });

    if (!res.ok) {
        throw new Error(res.statusText)
    } else {
        return await res.json();
    }
}