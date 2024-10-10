import axios from "axios";
import React, { useEffect, useCallback, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import EditProfile from "../components/tabs/EditProfile";
import Search from "../components/tabs/Search";
import ChatPage from "../components/tabs/ChatPage";
import Navbar from "../components/NavBar";

import useUserStore from '../states/userStore';
import useChatStore from '../states/chatStore';
import useSocketStore from '../states/socketStore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(['token']);
  const { user, setUser } = useUserStore();
  const { setCurrentChatId } = useChatStore();
  const [currentTab, setCurrentTab] = useState("search");

  const { connectSocket, disconnectSocket } = useSocketStore();

  const Logout = useCallback(() => {
    setUser(null);
    googleLogout();
    removeCookie("token");
    navigate("/signin");
  }, [navigate, setUser, removeCookie]);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token || cookies.token === "undefined") {
        navigate("/signin");
        return;
      }
      try { 
        const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}`, {}, { withCredentials: true });
        const { status, user } = data;
        
        if (status) {
          setUser(user);
          connectSocket(user._id);
          
          return () => {
            disconnectSocket();
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
  }, [cookies, navigate, Logout, setUser, connectSocket, disconnectSocket]);

  return (
    <section className="flex h-screen">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} Logout={Logout} />
      <div className="container mx-auto flex flex-col gap-16 py-24 w-full overflow-y-auto">
        {user ? (
          currentTab === "editProfile" ? <EditProfile /> :
          currentTab === "search" ? <Search setCurrentTab={setCurrentTab} setCurrentChatId={setCurrentChatId} /> :
          currentTab === "chat" ? <ChatPage /> : 
          <EditProfile />
        ) : null}
      </div>
    </section>
  );
}

export default Dashboard;
