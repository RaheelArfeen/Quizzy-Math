import React, { createContext, useEffect, useState } from "react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import axios from "axios";
import app from "../Firebase/firebase.init";
import Loader from "../Pages/Loader";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const register = async (name, email, password, photoURL) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            await updateProfile(firebaseUser, {
                displayName: name,
                photoURL: photoURL || null,
            });

            const lastSignInTime = new Date(firebaseUser.metadata.lastSignInTime).toISOString();

            const res = await axios.post("http://localhost:3000/register", {
                email,
                displayName: firebaseUser.displayName,
                photoURL,
                lastSignInTime,
            });

            const token = res.data.token;
            localStorage.setItem("QuizyMath-token", token);

            setUser({
                displayName: firebaseUser.displayName,
                email,
                photoURL,
                accessToken: token,
                lastSignInTime,
            });

            setLoading(false);
            return firebaseUser;
        } catch (err) {
            console.error("Register error:", err);
            setLoading(false);
            throw err;
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const lastSignInTime = new Date(firebaseUser.metadata.lastSignInTime).toISOString();

            const res = await axios.post("http://localhost:3000/login", { email });

            const token = res.data.token;
            localStorage.setItem("QuizyMath-token", token);

            setUser({
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                accessToken: token,
                lastSignInTime,
            });

            setLoading(false);
            return true;
        } catch (err) {
            setLoading(false);
            throw err;
        }
    };

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            const lastSignInTime = new Date(firebaseUser.metadata.lastSignInTime).toISOString();

            const res = await axios.post("http://localhost:3000/login", {
                email: firebaseUser.email,
            });

            const token = res.data.token;
            localStorage.setItem("QuizyMath-token", token);

            setUser({
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                accessToken: token,
                lastSignInTime,
            });

            setLoading(false);
            return true;
        } catch (err) {
            console.error("Google login error:", err);
            setLoading(false);
            throw err;
        }
    };

    const updateUser = async (updatedData) => {
        try {
            await updateProfile(auth.currentUser, updatedData);
            const { displayName, email, photoURL, metadata } = auth.currentUser;
            const lastSignInTime = new Date(metadata.lastSignInTime).toISOString();

            setUser((prev) => ({
                ...prev,
                displayName,
                email,
                photoURL,
                lastSignInTime,
            }));
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            localStorage.removeItem("QuizyMath-token");
            setUser(null);
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken(true);
                    localStorage.setItem("QuizyMath-token", token);

                    const lastSignInTime = new Date(currentUser.metadata.lastSignInTime).toISOString();

                    setUser({
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        accessToken: token,
                        lastSignInTime,
                    });
                } catch (error) {
                    console.error("Auth sync error:", error);
                    const fallbackToken = await currentUser.getIdToken();
                    const lastSignInTime = new Date(currentUser.metadata.lastSignInTime).toISOString();

                    localStorage.setItem("QuizyMath-token", fallbackToken);
                    setUser({
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        accessToken: fallbackToken,
                        lastSignInTime,
                    });
                }
            } else {
                setUser(null);
                localStorage.removeItem("QuizyMath-token");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                createUser: register,
                signIn: login,
                loginWithGoogle,
                updateUser,
                logOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;