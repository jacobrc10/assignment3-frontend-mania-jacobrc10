import React from 'react'
import Report from './Report';
import Nav from 'react-bootstrap/Nav'

import {
  Routes,
  Route,
  Link
} from "react-router-dom";

function Dashboard({ accessToken, setAccessToken, refreshToken }) {
  return (
    <div>
      <h1>
        Admin Dashboard
      </h1>
      <Nav variant="tabs" >
          <Nav.Item><Nav.Link href="/report/1"><Link to="/report/1">Unique API users</Link></Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="/report/2"><Link to="/report/2">Top API users</Link></Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="/report/3"><Link to="/report/3">Top users By Endpoint</Link></Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="/report/4"><Link to="/report/4">4xx Errors By Endpoint</Link></Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link href="/report/5"><Link to="/report/5">Recent 4xx/5xx Errors</Link></Nav.Link></Nav.Item>
      </Nav>

      <Routes>
        <Route path="/report/1" element={<Report id={1} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
        <Route path="/report/2" element={<Report id={2} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
        <Route path="/report/3" element={<Report id={3} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
        <Route path="/report/4" element={<Report id={4} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
        <Route path="/report/5" element={<Report id={5} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
      </Routes>

      <br />
      <br />
      <h1>
        User Content
      </h1>
    </div>
  )
}

export default Dashboard