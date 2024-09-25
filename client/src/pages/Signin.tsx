import axios from 'axios';
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

import { FaGoogle } from "react-icons/fa";

interface GoogleAuthResponse {
    code: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
}

const Signin: React.FC = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies(['token']);
    
    useEffect(() => {
        if (cookies.token && cookies.token !== "undefined") {
            navigate("/");
        }
    }, [cookies, navigate]);

    const handleGoogleAuth = async ({ code }: GoogleAuthResponse) => {   
        try {
            const { data } = await axios.post<AuthResponse>("http://localhost:5000/auth/google", { code }, { withCredentials: true });
    
            const { success, message } = data;
            if (success) {
                console.log("Success");
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                console.error(message);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: handleGoogleAuth,
        flow: "auth-code"
    });

    return (
        <section className="container mx-auto flex justify-center items-center h-svh">
            <button onClick={handleGoogleLogin} className="text-neutral-950 flex gap-2 justify-center items-center p-4 rounded-md border shadow-lg font-medium text-lg transition-all duration-200 hover:-translate-y-0.5 bg-white">
                <FaGoogle size="1.125rem"/>Google
            </button>
        </section>
    );
}

export default Signin;