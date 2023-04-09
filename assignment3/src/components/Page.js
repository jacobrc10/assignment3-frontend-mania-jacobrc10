import React, {useState} from 'react'
import '../css/Page.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/esm/Col';

function Page({pokemons, currentPage, pageSize}) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPokemons = pokemons.slice(startIndex, endIndex);

  const [show, setShow] = useState(false);
  const [currPokemon, setPokemon] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div
    id='pokemon-container'
    >
      {
        currentPokemons.map(pokemon => (
          <Card
          className='pokemon'
          key={pokemon.id}>
            {
              pokemon.id < 10 &&
              <Card.Img
              src={"https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/00" + pokemon.id + ".png"}
              alt={pokemon.name.english}
              style={{maxWidth: '150px'}}
              />
            }
            {
              pokemon.id >= 10 && pokemon.id < 100 &&
              <Card.Img
              src={"https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/0" + pokemon.id + ".png"}
              alt={pokemon.name.english}
              style={{maxWidth: '150px'}}
              />
            }
            {
              pokemon.id >= 100 &&
              <Card.Img
              src={"https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/" + pokemon.id + ".png"}
              alt={pokemon.name.english}
              style={{maxWidth: '150px'}}
              />
            }
            <Card.Body
            style={{textAlign: 'center',
            width: '10rem'
            }}
            >
              <Card.Title>{pokemon.name.english}</Card.Title>
              <Card.Text>
                {pokemon.type.join(', ')}
              </Card.Text>
              <Button 
              variant="primary"
              onClick={() => {
                setPokemon(pokemon);
                console.log(currPokemon);
                handleShow();
              }}
              >Go somewhere</Button>
            </Card.Body>
          </Card>
        ))
      }
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>#{currPokemon?.id} {currPokemon?.name?.english}</Modal.Title>
        </Modal.Header>
        <Modal.Body
        style={{textAlign: 'center'}}
        >
            {
              currPokemon?.id < 10 &&
              <Card.Img
              src={"https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/00" + currPokemon?.id + ".png"}
              alt={currPokemon?.name?.english}
              style={{maxWidth: '250px'}}
              />
            }
            {
              currPokemon?.id >= 10 && currPokemon?.id < 100 &&
              <Card.Img
              src={"https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/0" + currPokemon?.id + ".png"}
              alt={currPokemon?.name?.english}
              style={{maxWidth: '250px'}}
              />
            }
            {
              currPokemon?.id >= 100 &&
              <Card.Img
              src={"https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/" + currPokemon?.id + ".png"}
              alt={currPokemon?.name?.english}
              style={{maxWidth: '250px'}}
              />
            }
        </Modal.Body>
        <Modal.Footer>
          <Col>
            <p><b>Types:</b></p>
            <p><b>HP:</b></p>
            <p><b>Attack:</b></p>
            <p><b>Defense:</b></p>
            <p><b>Sp. Atk:</b></p>
            <p><b>Sp. Def:</b></p>
            <p><b>Speed:</b></p>
          </Col>
          <Col>
            <p>{currPokemon?.type?.join(', ')}</p>
            <p>{currPokemon?.base?.HP}</p>
            <p>{currPokemon?.base?.Attack}</p>
            <p>{currPokemon?.base?.Defense}</p>
            <p>{currPokemon?.base?.['Sp. Attack']}</p>
            <p>{currPokemon?.base?.['Sp. Defense']}</p>
            <p>{currPokemon?.base?.Speed}</p>
          </Col>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Page