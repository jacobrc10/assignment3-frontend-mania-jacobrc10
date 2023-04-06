import Page from './components/Page';
import Pagination from './components/Pagination';
import React from 'react';
import axios from 'axios';
import './css/App.css';

function App() {

  // Grab the data from the API
  const [pokemons, setPokemons] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  React.useEffect(() => {
    axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
      .then(response => {
        setPokemons(response.data);

      })
  }, []);



  return (
    <div className="App">
      <Page pokemons={pokemons} currentPage={currentPage}/>
      <Pagination
      pokemons={pokemons}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={page => {
        if (page < 1 || page > Math.ceil(pokemons.length / pageSize)) return;
        setCurrentPage(page);
      }}/>
    </div>
  );
}

export default App;
