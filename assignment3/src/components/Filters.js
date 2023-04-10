import React from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Filters({types, setSelectedTypes, setName}){

    return (
        <div className="filters">
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="formNameSearch">
                    <Form.Label column sm={2}>Name</Form.Label>
                    <Col sm={10}>
                    <Form.Control 
                    type="text" 
                    placeholder='e.g. "Pikachu"' 
                    onChange={e => setName(e.target.value)}
                    />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>Type</Form.Label>
                    <Col sm={10}>
                    {
                        types.map(type => (
                            <Form.Check
                            inline
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
                    </Col>
                </Form.Group>
            </Form>
        </div>
    )
}

export default Filters