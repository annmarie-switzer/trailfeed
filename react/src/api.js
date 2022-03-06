export const getUser = async () => {
    const res = await fetch('/api/user', {
        credentials: 'include'
    });

    return await res.json();
};

export const logout = async () => {
    await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
    });

    window.location.href = '/';
};

export const search = async (req, count) => {
    count = count || 0;

    console.log('Sending search req. number: ', count);

    const res = await fetch('/api/es/search', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        return await res.json();
    } else {
        // Requests will be retried up to 5 times if they fail with a 429 error code.
        if (res.status === 429 && count < 5) {
            // poor man's exponential backoff
            setTimeout(() => {
                search(req, ++count);
            }, count * 300);
        } else {
            throw new Error(await res.text());
        }
    }
};

export const updateRating = async (req) => {
    const res = await fetch('/api/es/update-rating', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' }
    });

    return await res.json();
};

export const addDoc = async (req) => {
    const res = await fetch('/api/es/add-doc', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(req),
        headers: { 'Content-Type': 'application/json' }
    });

    return await res.json();
};
