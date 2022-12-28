import { Index, MealSource, RatingSource } from './type';

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

type SearchBody = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any;
    index: Index;
};

export const search = async (body: SearchBody, count = 0) => {
    const res = await fetch('/api/es/search', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        return await res.json();
    } else {
        // Requests will be retried up to 5 times if they fail with a 429 error code.
        if (res.status === 429 && count < 10) {
            // poor man's exponential backoff
            setTimeout(async () => {
                await search(body, ++count);
            }, count * 500);
        } else {
            throw new Error(await res.text());
        }
    }
};

type UpdateRatingBody = {
    docId: string;
    rating: number;
};

export const updateRating = async (body: UpdateRatingBody) => {
    const res = await fetch('/api/es/update-rating', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });

    return await res.json();
};

type NewDocBody = {
    newDoc: MealSource | RatingSource;
    index: Index;
};

export const addDoc = async (body: NewDocBody) => {
    const res = await fetch('/api/es/add-doc', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });

    return await res.json();
};

export const deleteMeal = async (id: string) => {
    const res = await fetch(`/api/es/delete-meal/${id}`, {
        credentials: 'include',
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    return await res.json();
};
