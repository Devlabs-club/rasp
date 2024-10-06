import axios from "axios";
import { googleLogout } from "@react-oauth/google";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { createContext } from 'react';
import io from "socket.io-client";

import EditProfile from "../components/tabs/EditProfile";
import Search from "../components/tabs/Search";
import ChatPage from "../components/tabs/ChatPage";
import Navbar from "../components/NavBar";

const UserContext = createContext<any>(null);
const SocketContext = createContext<any>(null);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(['token']);
  const [user, setUser] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("search"); // State to track current tab
  const [chatReceiver, setChatReceiver] = useState<string | null>(null);

  const socket = useRef<any>(null);

  const Logout = useCallback(() => {
    setUser(null);
    googleLogout();
    removeCookie("token");
    navigate("/signin");
  }, [navigate, removeCookie]);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token || cookies.token === "undefined") {
        navigate("/signin");
        return;
      }
      try {
        const { data } = await axios.post("http://localhost:5000", {}, { withCredentials: true });
        const { status, user } = data;
        
        if (status) {
          setUser(user);
          
          socket.current = io("http://localhost:5000", {
            query: { userId: user._id }
          });

          socket.current?.on("user-update", async (updatedUser: any) => {
            setUser(updatedUser);    
          });
        
          return () => {
            socket.current?.disconnect();
          }
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
    <SocketContext.Provider value={socket}>
      <UserContext.Provider value={user}>
        <section className="flex">
          <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <div className="container mx-auto flex flex-col gap-16 py-24 w-full">
            {user ? (
              currentTab === "editProfile" ? <EditProfile /> :
              currentTab === "search" ? <Search setChatReceiver={setChatReceiver} setCurrentTab={setCurrentTab} /> : // Pass the setCurrentTab prop here
              currentTab === "chat" ? <ChatPage chatReceiver={chatReceiver} setChatReceiver={setChatReceiver} /> : 
              <EditProfile />
            ) : null}
            <button onClick={Logout} className="text-white flex gap-2 justify-center items-center px-4 py-2 rounded-md font-medium transition-all duration-200 hover:-translate-y-0.5 bg-red-500 w-fit">
              Logout
            </button>
          </div>
        </section>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
}

export { UserContext, SocketContext };
export default Dashboard;
