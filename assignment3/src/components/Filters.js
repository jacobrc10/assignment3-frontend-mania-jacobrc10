import React from 'react'
import Form from 'react-bootstrap/Form'

function Filters({types, setSelectedTypes, setName}){

    return (
        <div className="filters">
            <Form>
                <Form.Group controlId="formNameSearch">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter name" 
                    onChange={e => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formTypeCheckBoxes">
                    {
                        types.map(type => (
                            <Form.Check
                            type="checkbox"
                            label={type.english}
                            key={type.english}
                            onChange={e => {
                                if (e.target.checked){
                                    setSelectedTypes(prevState => [...prevState, type.english])
                                } else {
                                    setSelectedTypes(prevState => prevState.filter(t => t !== type.english))
                                }
                            }}
                            />
                        ))

                    }
                </Form.Group>
            </Form>
        </div>
    )
}

export default Filters