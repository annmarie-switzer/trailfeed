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
    const [currentStat, setCurrentStat] = useState(0);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        document.body.dataset.theme = theme;

        getUser()
            .catch(() => { console.log('caught error'); setUser(null) })
            .then((res) => { console.log('moving on'); setUser(res) });
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
                }}>
                <AppContext.Provider
                    value={{
                        user,
                        theme,
                        setTheme,
                        currentStat,
                        setCurrentStat,
                        setModalData
                    }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/new-meal"
                            element={user ? <NewMeal /> : <Navigate to="/login" />}
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
