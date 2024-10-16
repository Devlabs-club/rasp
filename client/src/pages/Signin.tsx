import axios from 'axios';
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { FaGoogle } from "react-icons/fa";

import HeadingBig from '../components/text/HeadingBig';

import getCookie from '../utils/getCookie';

interface GoogleAuthResponse {
    code: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
}

function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

const Signin: React.FC = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = getCookie('token');
        if (token && token !== "undefined") {
            navigate("/");
        }
    }, [navigate]);

    const handleGoogleAuth = async ({ code }: GoogleAuthResponse) => {   
        try {
            const { data } = await axios.post<AuthResponse>(`${process.env.REACT_APP_SERVER_URL}/auth/google`, { code }, { withCredentials: true });
    
            const { success, message, token } = data;
            setCookie("token", token, 7);
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
        <section className="bg-black flex flex-col justify-center items-center min-h-screen">
            <div className="text-white text-left text-6xl leading-tight mb-10">
                <HeadingBig>
                    <span className="text-orange-400">r</span>etrieval
                </HeadingBig>
                <HeadingBig>
                    <span className="text-orange-400">a</span>ugmented
                </HeadingBig>
                <HeadingBig>
                    <span className="text-orange-400">s</span>earch
                </HeadingBig>
                <HeadingBig>
                    <span className="ml-[-5rem]">for </span> <span className="text-orange-400">p</span>eople
                </HeadingBig>
            </div>


            {/* Google Login Button */}
            <button 
                onClick={handleGoogleLogin} 
                className="text-neutral-950 flex gap-2 justify-center items-center p-4 rounded-md border shadow-lg font-medium text-lg transition-all duration-200 hover:-translate-y-0.5 bg-white">
                <FaGoogle size="1.125rem"/>Google
            </button>
        </section>
    );
}

export default Signin;