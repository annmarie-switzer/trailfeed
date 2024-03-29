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
import { MealSource, User } from './types';

type Context = {
    user: User;
    setUser: Dispatch<SetStateAction<User | null>>;
    theme: string;
    setTheme: Dispatch<SetStateAction<string>>;
    maxCalories: number;
    setMaxCalories: Dispatch<SetStateAction<number>>;
    maxOunces: number;
    setMaxOunces: Dispatch<SetStateAction<number>>;
    selection: MealSource[];
    setSelection: Dispatch<SetStateAction<MealSource[]>>;
};

export const AppContext = createContext<Context>({} as Context);

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    const [maxCalories, setMaxCalories] = useState(
        Number(localStorage.getItem('trailfeedMaxCalories')) || 9000
    );

    const [maxOunces, setMaxOunces] = useState(
        Number(localStorage.getItem('trailfeedMaxOunces')) || 96
    );

    const [selection, setSelection] = useState<MealSource[]>([]);

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
                        selection,
                        setSelection
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
        </>
    );
}

export default App;
