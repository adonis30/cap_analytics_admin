import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setLoading } from "state/index"; // Correct imports
import axios from "axios";

const AuthGuard = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth?.user);
    const isLoading = useSelector((state) => state.auth?.isLoading);

    useEffect(() => {
        const token = localStorage.getItem("token");

       

        if (token && !user) {
            dispatch(setLoading(true));
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const storedUser = localStorage.getItem("user");
            
            if (storedUser) {
                try {
                    // Make sure the storedUser is a valid JSON string
                    const parsedUser = JSON.parse(storedUser);
                    console.log("Parsed User:", parsedUser); // Debugging log


                    if (parsedUser && parsedUser._id) {
                        // Dispatch the action to set the user
                        dispatch(setUser({ user: parsedUser, token }));
                    } else {
                        // If parsedUser does not have valid properties, clear it
                        console.log("Invalid user data in localStorage");
                        localStorage.removeItem("user");
                    }
                } catch (error) {
                    console.error("Failed to parse stored user:", error);
                    localStorage.removeItem("user"); // Remove invalid data
                }
            } else {
                console.log("No user data found in localStorage.");
            }

            dispatch(setLoading(false));
        }
    }, [dispatch, user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default AuthGuard;
