import axios from "axios";
import { googleLogout } from "@react-oauth/google";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import EditProfile from "../components/tabs/EditProfile";
import Search from "../components/tabs/Search";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [cookies, , removeCookie] = useCookies(['token']);
    const [user, setUser] = useState<any | null>(null);

    const Logout = useCallback(() => {
        setUser(null);
        googleLogout();
        removeCookie("token");
        navigate("/signin");
    }, [navigate, removeCookie]);

    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token || cookies.token === "undefined") {
                console.log("hello");
                navigate("/signin");
                return;
            }
            try {
                const { data } = await axios.post("http://localhost:5000", {}, { withCredentials: true });
                const { status, user } = data;
                
                if (status) {
                    setUser(user);
                } else {
                    Logout();
                }
            } catch (error) {
                console.error("Error verifying cookie", error);
                Logout();
            }
        };
        verifyCookie();    
    }, [cookies, navigate, Logout]);

    return (
        <section className="container mx-auto flex flex-col gap-16 py-24">
            {user ? (user.about?.bio ? <Search user={user} /> : <EditProfile user={user} setUser={setUser} />) : null}
            <button onClick={Logout} className="text-white flex gap-2 justify-center items-center px-4 py-2 rounded-md font-medium transition-all duration-200 hover:-translate-y-0.5 bg-red-500 w-fit"></button>
        </section>
    );
}

export default Dashboard;