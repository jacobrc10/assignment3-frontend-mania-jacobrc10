import React from "react";

function Login(handleSubmit) {
  return (
    <form onSubmit={handleSubmit}>
      <span> Admin Login </span>
      <br />
      <input
        type="text"
        placeholder="username"
      />
      <br />
      <input
        type="password"
        placeholder="password"
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
