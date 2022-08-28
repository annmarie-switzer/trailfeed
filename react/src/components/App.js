import React, { createContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getUser } from 'api';
import Login from 'components/Login';
import Home from 'components/Home';
import Modal from 'components/Modal';
import NewMeal from 'components/NewMeal';

export const AppContext = createContext(null);

function App() {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark'
    );

    const [maxCalories, setMaxCalories] = useState(
        Number(localStorage.getItem('trailfeedMaxCals')) || 9000
    );

    const [maxOunces, setMaxOunces] = useState(
        Number(localStorage.getItem('trailfeedMaxOunces')) || 96
    );

    // TODO - why does this need to be in state?
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        document.body.dataset.theme = theme;

        getUser()
            .catch(() => setUser(null))
            .then((res) => setUser(res));
    }, []);

    if (user === null) {
        return null;
    }

    return (
        <>
            <div
                id="app"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh'
                }}
            >
                <AppContext.Provider
                    value={{
                        user,
                        setUser,
                        theme,
                        setTheme,
                        maxCalories,
                        setMaxCalories,
                        maxOunces,
                        setMaxOunces,
                        setModalData
                    }}
                >
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/new-meal"
                            element={
                                user?.email ? (
                                    <NewMeal />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/"
                            element={user ? <Home /> : <Navigate to="/login" />}
                        />
                    </Routes>
                </AppContext.Provider>
            </div>

            {modalData ? (
                <Modal modalData={modalData} setModalData={setModalData} />
            ) : null}
        </>
    );
}

export default App;
