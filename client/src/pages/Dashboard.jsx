import axios from "axios";
import { googleLogout } from "@react-oauth/google";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Dashboard = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [user, setUser] = useState({});

    const Logout = useCallback(() => {
        googleLogout();
        removeCookie("token");
        navigate("/signin");
    }, [navigate, removeCookie]);

    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token || cookies.token === "undefined") {
                navigate("/signin");
            }
            const { data } = await axios.post("http://localhost:5000", {}, { withCredentials: true });
            const { status, user } = data;
            
            return status ? setUser(user) : Logout();
        };
        verifyCookie();
    }, [cookies, navigate, Logout]);


    console.log(user);

    return (
        user 
        ? 
        <section className="container mx-auto flex flex-col justify-center items-center h-svh">
            <p>You're logged in</p>
            <button onClick={Logout} className="text-neutral-950 flex gap-2 justify-center items-center p-4 rounded-md border shadow-lg font-medium text-lg transition-all duration-200 hover:-translate-y-0.5 bg-white">Logout</button>
        </section> 
        : 
        <></>        
    );
}

export default Dashboard;