import React from "react";
import { toast } from "react-hot-toast";
import AxiosInstance from "../Axiosconfig/Axios.config";

const Login = () => {
  const handleLogin = async () => {
    try {
      // Step 1: Make a GET request to /google to get the Google OAuth URL
      const response = await AxiosInstance.get("/google");
      // Step 2: Redirect the user to the Google OAuth page
      const googleAuthURL = response.data; // This is the URL returned by your backend
      window.location.href = googleAuthURL; // Redirect the user to Google for authentication
    } catch (error) {
      console.error("Failed to get Google OAuth URL:", error);
      toast.error("Failed to initiate login. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Sign in with Google
        </h2>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
