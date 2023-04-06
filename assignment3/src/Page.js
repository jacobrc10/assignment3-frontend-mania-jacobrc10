import React from 'react'
import './Page.css'

function Page({pokemons, currentPage}) {
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPokemons = pokemons.slice(startIndex, endIndex);

  return (
    <div
    id='pokemon-container'
    >
      {
        currentPokemons.map(pokemon => (
          <div
          className='pokemon'
          key={pokemon.id}>
            {
              pokemon.id < 10 &&
              <img
              src={"https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/00" + pokemon.id + ".png"}
              alt={pokemon.name.english}
              style={{width: '100px'}}
              />
            }
            {
              pokemon.id >= 10 && pokemon.id < 100 &&
              <img
              src={"https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/0" + pokemon.id + ".png"}
              alt={pokemon.name.english}
              style={{width: '100px'}}
              />
            }
            {
              pokemon.id >= 100 &&
              <img
              src={"https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/" + pokemon.id + ".png"}
              alt={pokemon.name.english}
              style={{width: '100px'}}
              />
            }
            <h3>{pokemon.name.english}</h3>
          </div>
        ))
      }
    </div>
  )
}

export default Page