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
    deleteUser as firebaseDeleteUser, // Alias to avoid naming conflict
} from "firebase/auth";
import axios from "axios";
import app from "../Firebase/firebase.init"; // Assuming this correctly initializes Firebase

export const AuthContext = createContext();
const auth = getAuth(app); // Get the Firebase Auth instance

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Renamed from 'register' to 'createUser' for consistency with Login component
    const createUser = async (name, email, password, photoURL) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            await updateProfile(firebaseUser, {
                displayName: name,
                photoURL: photoURL || null,
            });

            const lastSignInTime = new Date(firebaseUser.metadata.lastSignInTime).toISOString();

            // Send user data to your backend for registration
            const res = await axios.post("http://localhost:3000/register", {
                email,
                displayName: firebaseUser.displayName,
                photoURL,
                lastSignInTime,
            });

            const token = res.data.token;
            localStorage.setItem("QuizyMath-token", token);

            // Set user state with data from Firebase and backend role
            setUser({
                displayName: firebaseUser.displayName,
                email,
                photoURL,
                role: res.data.user.role || "member", // Default to 'member' if role not provided by backend
                accessToken: token,
                lastSignInTime,
            });

            setLoading(false);
            return firebaseUser;
        } catch (err) {
            console.error("Firebase createUser/Backend register error:", err);
            setLoading(false);
            // Re-throw the error so the calling component (Login) can catch and display it
            throw err;
        }
    };

    // Renamed from 'login' to 'signIn' for consistency with Login component
    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const lastSignInTime = new Date(firebaseUser.metadata.lastSignInTime).toISOString();

            // Send user email to backend for login/role retrieval
            const res = await axios.post("http://localhost:3000/login", { email });

            const token = res.data.token;
            localStorage.setItem("QuizyMath-token", token);

            // Set user state with data from Firebase and backend role
            setUser({
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                role: res.data.user.role || "member",
                accessToken: token,
                lastSignInTime,
            });

            setLoading(false);
            return true;
        } catch (err) {
            console.error("Firebase signIn/Backend login error:", err);
            setLoading(false);
            throw err; // Re-throw the error for Login component to handle
        }
    };

    // Kept as 'loginWithGoogle' as it was already consistent with Login component's call
    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            const lastSignInTime = new Date(firebaseUser.metadata.lastSignInTime).toISOString();

            // Send user email to backend for login/role retrieval (or registration if new)
            // Your backend should handle if this user is new or existing.
            const res = await axios.post("http://localhost:3000/login", {
                email: firebaseUser.email,
            });

            const token = res.data.token;
            localStorage.setItem("QuizyMath-token", token);

            // Set user state with data from Firebase and backend role
            setUser({
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                role: res.data.user.role || "member",
                accessToken: token,
                lastSignInTime,
            });

            setLoading(false);
            return true;
        } catch (err) {
            console.error("Google login error:", err);
            setLoading(false);
            throw err; // Re-throw the error for Login component to handle
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
            throw error; // Re-throw for calling component to handle
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
            throw err; // Re-throw for calling component to handle
        } finally {
            setLoading(false);
        }
    };

    // Added deleteUser function for completeness
    const deleteUser = async (userToDelete) => {
        setLoading(true);
        try {
            await firebaseDeleteUser(userToDelete);
            console.log("Firebase user deleted successfully.");
            setUser(null); // Clear user state after deletion
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error; // Re-throw for calling component to handle
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true); // Set loading true at the start of the observer
            if (currentUser) {
                try {
                    // Get fresh ID token
                    const token = await currentUser.getIdToken(true);
                    localStorage.setItem("QuizyMath-token", token);

                    // Fetch role from backend
                    const roleRes = await axios.get(
                        `http://localhost:3000/users/role/${currentUser.email}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const lastSignInTime = new Date(currentUser.metadata.lastSignInTime).toISOString();

                    setUser({
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        role: roleRes.data.role || "member",
                        accessToken: token,
                        lastSignInTime,
                    });
                } catch (error) {
                    console.error("Auth state change sync error with backend:", error);
                    // Fallback if backend call fails but Firebase user is still authenticated
                    const fallbackToken = await currentUser.getIdToken();
                    const lastSignInTime = new Date(currentUser.metadata.lastSignInTime).toISOString();

                    localStorage.setItem("QuizyMath-token", fallbackToken);
                    setUser({
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL,
                        role: "member", // Default to member if role fetch fails
                        accessToken: fallbackToken,
                        lastSignInTime,
                    });
                }
            } else {
                setUser(null);
                localStorage.removeItem("QuizyMath-token");
            }
            setLoading(false); // Set loading false after processing
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                createUser, // Renamed from 'register'
                signIn, // Renamed from 'login'
                loginWithGoogle,
                updateUser,
                logOut,
                deleteUser, // Exposed deleteUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
