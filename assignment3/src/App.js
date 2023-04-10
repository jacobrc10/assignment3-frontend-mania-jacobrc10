import Page from "./components/Page";
import IPaginations from "./components/Paginations";
import React, { useState } from "react";
import axios from "axios";
import "./css/App.css";
import Filters from "./components/Filters";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/Dashboard";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Spinner from "react-bootstrap/Spinner";

function App() {
  // Grab the data from the API
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = React.useState([]);
  const [filteredPokemons, setFilteredPokemons] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [types, setTypes] = React.useState([]);
  const [selectedTypes, setSelectedTypes] = React.useState([]);
  const [name, setName] = React.useState([]);
  const pageSize = 12;

  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || ""
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const values = {
        username: e.target.username.value,
        password: e.target.password.value,
      };
      const res = await axios.post("http://localhost:5000/login", values);
      setUser(res.data);
      setAccessToken(res.headers["auth-token-access"]);
      setRefreshToken(res.headers["auth-token-refresh"]);
      localStorage.setItem("accessToken", res.headers["auth-token-access"]);
      localStorage.setItem("refreshToken", res.headers["auth-token-refresh"]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(
        "http://localhost:5000/logout",
        {},
        {
          headers: {
            "auth-token-access": accessToken,
            "auth-token-refresh": refreshToken,
          },
        }
      );
      setUser({});
      setAccessToken("");
      setRefreshToken("");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
      )
      .then((response) => {
        setPokemons(response.data);
      });
  }, []);

  React.useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json"
      )
      .then((response) => {
        setTypes(response.data);
      });
  }, []);

  React.useEffect(() => {
    let filtered = pokemons;
    if (name.length > 0) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.english.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((pokemon) => {
        // Check if the pokemon has ALL the selected types
        for (let i = 0; i < selectedTypes.length; i++) {
          if (!pokemon.type.includes(selectedTypes[i])) return false;
        }
        return true;
      });
    }
    setCurrentPage(1);
    setFilteredPokemons(filtered);
  }, [pokemons, selectedTypes, name]);

  // If the user has a refresh token, retrieve a new access token and the user data
  React.useEffect(() => {
    if (refreshToken) {
      axios
        .post(
          "http://localhost:5000/requestNewAccessToken",
          {},
          {
            headers: {
              "auth-token-refresh": refreshToken,
            },
          }
        )
        .then((res) => {
          setAccessToken(res.headers["auth-token-access"]);
          const axiosConfig = {
            headers: {
              "auth-token-access": res.headers["auth-token-access"],
            },
          };
          axios
            .post("http://localhost:5000/user", {}, axiosConfig)
            .then((res) => {
              setUser(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [refreshToken]);

  if (loading) {
    return (
      <div 
      className="App d-flex justify-content-center align-items-center"
      >
        <Spinner 
        animation="border" 
        role="status"
        style={{
          width: "100px",
          height: "100px",
          margin: "15rem",
        }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      {!user.username ? (
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Card style={{ padding: "2rem", width: "30rem" }}>
            <Form onSubmit={handleSubmit}>
              <h1 id="loginHeader" style={{ textAlign: "center" }}>Pokepedia</h1>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                />
              </Form.Group>
              <br/>
              <Form.Group className="d-grid gap-2 mb-3">
              <Button as="input" variant="danger" type="submit" value="Login" />{" "}
              </Form.Group>
            </Form>
          </Card>
        </Container>
      ) : (
        <div
        id="main"
        >
          <Navbar id="nav" bg="dark" variant="dark">
            <Container>
              <Navbar.Brand>Pokepedia</Navbar.Brand>
              <Navbar.Collapse className="justify-content-end">
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container>
            <br/>
            <div className="d-flex justify-content-center mb-3">
            <h1>Welcome back, {user.username}</h1>
            </div>
            {user.role === "admin" ? (
              <Dashboard
                accessToken={accessToken}
                setAccessToken={setAccessToken}
                refreshToken={refreshToken}
              />
            ) : null}
            <Filters
              types={types}
              setSelectedTypes={setSelectedTypes}
              setName={setName}
            />
            <Page
              pokemons={filteredPokemons}
              currentPage={currentPage}
              pageSize={pageSize}
            />
            <IPaginations
              pokemons={filteredPokemons}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={(page) => {
                if (
                  page < 1 ||
                  page > Math.ceil(filteredPokemons.length / pageSize)
                )
                  return;
                setCurrentPage(page);
              }}
            />
            <br/>
          </Container>
        </div>
      )}
    </>
  );
}

export default App;
