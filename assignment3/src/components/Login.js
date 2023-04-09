import React, { useState } from 'react'
import axios from 'axios'
import Dashboard from './Dashboard';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  React.useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setAccessToken(localStorage.getItem('accessToken'));
    }
    if (localStorage.getItem('refreshToken')) {
      setRefreshToken(localStorage.getItem('refreshToken'));
    }
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { username, password });
      setUser(res.data);
      setAccessToken(res.headers['auth-token-access']);
      setRefreshToken(res.headers['auth-token-refresh']);
    } catch (err) {
      console.log(err);
    }
  }

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/logout", {}, {
        headers: {
          'auth-token-access': accessToken,
          'auth-token-refresh': refreshToken
        }
      });
      setUser({});
      setAccessToken('');
      setRefreshToken('');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {user?.username ? (
        <>
          <h1>API Dashboard</h1>
          <b>Welcome {user.username}</b>
          <Dashboard accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <span> Admin Login </span>
          <br />
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">
            Login
          </button>
        </form>
      )}
    </div>
  )
}

export default Login