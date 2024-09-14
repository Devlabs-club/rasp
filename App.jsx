import React, { useState } from 'react';
import GoogleLogin from './client/src/components/GoogleLogin/GoogleLogin';
import Profile from './client/src/components/Profile/Profile';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData.user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <Profile user={user} logout={logout} />
      ) : (
        <GoogleLogin login={login} />
      )}
    </>
  );
}

export default App;
