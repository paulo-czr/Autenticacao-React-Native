import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

export type AuthState = {
    isLoggedIn: boolean;
    isReady: boolean;
    signIn: () => void;
    signOut: () => void;
};

const AUTH_STORAGE_KEY = '@autenticacao:auth-state';

export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isReady, setIsReady] = useState(false);

    async function storageState(newState: { isLoggedIn: boolean }) {
        try {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
        } catch (error) {
            console.error('ERROR_SET_STORAGE_AUTH: ', error);
        }
    }

    function signIn() {
        setIsLoggedIn(true);
        storageState({ isLoggedIn: true });
        router.replace('/');
    }

    function signOut() {
        setIsLoggedIn(false);
        storageState({ isLoggedIn: false });
        router.replace('/signIn');
    }

    useEffect(() => {
        async function loadAuthState() {
            try {
                //Simulando delay de uma API.
                await new Promise((resolve) => setTimeout(resolve, 2000));

                const storedState = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
                const state = storedState ? JSON.parse(storedState) : null;

                setIsLoggedIn(state?.isLoggedIn ?? false);

            } catch (error) {
                console.error('ERROR_GET_STORAGE_AUTH: ', error);
                setIsLoggedIn(false);

            } finally {
                setIsReady(true);
            }
        }

        loadAuthState();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isReady, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}