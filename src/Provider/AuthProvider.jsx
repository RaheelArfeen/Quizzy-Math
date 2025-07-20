import React, { createContext, useEffect, useState } from "react";
import app from "../Firebase/Firebase.config";
import axios from "axios";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Save or update user using Axios
    const saveUserToBackend = async (userData) => {
        try {
            const { data } = await axios.post("http://localhost:3000/users", userData);
            console.log("✅ User sent to backend:", data);
        } catch (error) {
            console.error("❌ Failed to save user to backend:", error);
        }
    };

    const createUser = (email, password) => {
        setLoading(true);
        console.log("📝 Creating user with email:", email);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email, password) => {
        setLoading(true);
        console.log("🔐 Signing in with email:", email);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData)
            .then(async () => {
                const { displayName, email, photoURL, uid } = auth.currentUser;
                const updatedUser = {
                    displayName,
                    email,
                    photoURL,
                    uid,
                    lastSignInTime: new Date().toISOString(),
                };

                setUser(updatedUser);
                await saveUserToBackend(updatedUser);
                console.log("🔄 User profile updated and sent to backend");
            })
            .catch((error) => {
                console.error("❌ Error updating profile:", error);
            });
    };

    const logOut = () => {
        setLoading(true);
        console.log("🚪 Logging out...");
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const { displayName, email, photoURL, uid } = currentUser;
                const userData = {
                    displayName,
                    email,
                    photoURL,
                    uid,
                    lastSignInTime: new Date().toISOString(),
                };

                setUser(userData);
                await saveUserToBackend(userData);

                console.log("👤 Auth state changed: user signed in", email);
            } else {
                setUser(null);
                console.log("👋 Auth state changed: user signed out");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authData = {
        user,
        loading,
        createUser,
        signIn,
        updateUser,
        logOut,
    };

    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
