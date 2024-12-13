import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');

    const handleClick = async (button) => {
        setMessage(''); // Clear previous message
        try {
            const response = await axios.post('https://express-assignment-61e5561-395048402555.asia-south1.run.app/click', {button}, {
                headers: {
                    authorization: `Bearer`,
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || 'Rate limit reached');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Button Click App</h1>
                <div className="buttons">
                    <button className="blue" onClick={() => handleClick('blue')}>Blue Button</button>
                    <button className="red" onClick={() => handleClick('red')}>Red Button</button>
                </div>
                {message && <div className="message">{message}</div>}
            </header>
        </div>
    );
}

export default App;
