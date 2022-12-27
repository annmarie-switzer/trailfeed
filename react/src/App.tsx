import {
    createContext,
    Dispatch,
    SetStateAction,
    useEffect,
    useState
} from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getUser } from './api';
import { Home } from './pages/Home';
import { NewMeal } from './pages/NewMeal';
import { Login } from './components/Login';
import { Modal } from './components/Modal';

type User = {
    name: string;
    email: string;
};

type Context = {
    user: User;
    setUser: Dispatch<SetStateAction<any>>;
    theme: string;
    setTheme: Dispatch<SetStateAction<string>>;
    maxCalories: number;
    setMaxCalories: Dispatch<SetStateAction<number>>;
    maxOunces: number;
    setMaxOunces: Dispatch<SetStateAction<number>>;
    setModalData: Dispatch<SetStateAction<any>>;
};

export const AppContext = createContext<Context>({} as Context);

function App() {
    const [user, setUser] = useState<User | null>(null);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

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