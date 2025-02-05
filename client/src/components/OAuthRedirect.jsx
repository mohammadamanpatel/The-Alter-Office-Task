import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/auth.slice";
import { toast } from "react-hot-toast";

const OAuthRedirect = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const userId = queryParams.get("userId");

    // Log the parameters for debugging
    console.log("queryParams", queryParams);
    console.log("token", token);
    console.log("userId", userId);

    if (token && userId) {
      // Store the token and userId in localStorage or state
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Dispatch the user information to the Redux store
      dispatch(setUser({ token, userId }));

      // Show success toast
      toast.success("Login successful!");

      // Stop loading and redirect to home page
      setLoading(false);
      navigate("/"); // Redirect to home page
    } else {
      toast.error("Failed to authenticate. Please try again.");
      setLoading(false);
    }
  }, [dispatch, location, navigate]); // Add navigate to dependencies

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  return null; // Or redirect directly after successful authentication
};

export default OAuthRedirect;
