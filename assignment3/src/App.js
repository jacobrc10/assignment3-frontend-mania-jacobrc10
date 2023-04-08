import Page from './components/Page';
import IPaginations from './components/Paginations';
import React from 'react';
import axios from 'axios';
import './css/App.css';
import Filters from './components/Filters';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  // Grab the data from the API
  const [pokemons, setPokemons] = React.useState([]);
  const [filteredPokemons, setFilteredPokemons] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [types, setTypes] = React.useState([]);
  const [selectedTypes, setSelectedTypes] = React.useState([]);
  const [name, setName] = React.useState([]);
  const pageSize = 10;

  React.useEffect(() => {
    axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
      .then(response => {
        setPokemons(response.data);
      })
  }, []);

  React.useEffect(() => {
    axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json')
    .then(response => {
      setTypes(response.data);
    })
  }, []);

  React.useEffect(() => {
    let filtered = pokemons;
    if (name.length > 0){
      filtered = filtered.filter(pokemon => pokemon.name.english.toLowerCase().includes(name.toLowerCase()));
    }
    if (selectedTypes.length > 0){
      filtered = filtered.filter(pokemon => {
        // Check if the pokemon has ALL the selected types
        for (let i = 0; i < selectedTypes.length; i++){
          if (!pokemon.type.includes(selectedTypes[i])) return false;
        }
        return true;
      });
    }
    setCurrentPage(1);
    setFilteredPokemons(filtered);
  }, [pokemons, selectedTypes, name]);


  return (
    <div className="App">
      <Filters types={types} setSelectedTypes={setSelectedTypes} setName={setName}/>
      <Page pokemons={filteredPokemons} currentPage={currentPage}/>
      <IPaginations
      pokemons={filteredPokemons}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={page => {
        if (page < 1 || page > Math.ceil(filteredPokemons.length / pageSize)) return;
        setCurrentPage(page);
      }}/>
      <div>
        <h1>Selected Name</h1>
        <p>{name}</p>
      </div>
      <div>
        <h1>Selected Types</h1>
        <ul>
          {
            selectedTypes.map(type => (
              <li key={type}>{type}</li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default App;
