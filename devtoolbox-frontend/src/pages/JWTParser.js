import React, { useState } from 'react';
import { Card, Form, Table } from 'react-bootstrap';
import '../styles/ToolLayout.css';

const JWTParser = () => {
  const [jwt, setJwt] = useState('');
  const [header, setHeader] = useState({});
  const [payload, setPayload] = useState({});
  const [error, setError] = useState('');

  const parseJWT = async (jwt) => {
    try {
      const response = await fetch('http://localhost:8080/tool/jwt-parser/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt }),
      });

      if (response.ok) {
        const data = await response.json();
        setHeader(JSON.parse(data.header));
        setPayload(JSON.parse(data.payload));
        setError('');
      } else {
        setError('Failed to parse JWT. Please check your input.');
        setHeader({});
        setPayload({});
      }
    } catch (error) {
      console.error('Error during JWT parsing:', error);
      setError('An error occurred while parsing the JWT.');
      setHeader({});
      setPayload({});
    }
  };

React.useEffect(() => {
    // Parse the example JWT on initial render
    const exampleJwt =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCdWlIaWVuIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzE0MDk5NjAwLCJleHAiOjE3NDU2MzU2MDB9.YkBDjCBJ9YcQIKkT8M6fwfNPHa4TCOMf4GB-kO5N8vQGcv5OdPlfwqp1eCHxLCU-yPljQlWMC1I49Ra7jkpNSSz70c3yaIs-D5q1hN7NkS8dxJ2IewSVIkbT1WYbRzvK1nQK5Eok2jTfLCtoAEpgqfJZomOUjJu6-JyONK1Xrlk';
    setJwt(exampleJwt);
    parseJWT(exampleJwt);
}, []);

return (
    <div style={{ backgroundColor: '#FCF9F1', padding: '2rem' }}>
        <div className="tool-header">
            <h3>JWT Parser</h3>
            <p>Parse and decode your JSON Web Token (JWT) and display its content.</p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card className="bg-light text-dark p-4">
                <Card.Body>
                    <Form.Group className="mb-4">
                        <Form.Label>JWT to decode</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter your JWT here"
                            value={jwt}
                            onChange={(e) => {
                                setJwt(e.target.value);
                                parseJWT(e.target.value);
                            }}
                        />
                    </Form.Group>
                    {error && <p className="text-danger">{error}</p>}

                    {/* Header Section */}
                    {Object.keys(header).length > 0 && (
                        <>
                            <h5>Header</h5>
                            <Table striped bordered hover>
                                <tbody>
                                    {Object.entries(header).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}

                    {/* Payload Section */}
                    {Object.keys(payload).length > 0 && (
                        <>
                            <h5>Payload</h5>
                            <Table striped bordered hover>
                                <tbody>
                                    {Object.entries(payload).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    </div>
);
};

export default JWTParser;