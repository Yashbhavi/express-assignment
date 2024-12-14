import React, { useState } from 'react';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap'; // Import Toast and ToastContainer from react-bootstrap
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false); // State to control showing the toast
    const [isError, setIsError] = useState(false);

    const handleClick = async (button) => {
        setMessage(''); // Clear previous message
        setIsError(false)
        try {
            const response = await axios.post('https://express-app-c79e053-395048402555.asia-south1.run.app/click', { button }, {
                headers: {
                    authorization: `Bearer {idToken}`, // Replace with actual token
                    'Content-Type': 'application/json'
                }
            });
            console.log('response: ', response);
            setMessage(response.data.message);
            setShowToast(true); // Show toast on successful response
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || 'Rate limit reached');
                setIsError(true)
            } else {
                setMessage('An error occurred. Please try again.');
                setIsError(true)
            }
            setShowToast(true); // Show toast on error
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
            </header>

            {/* ToastContainer is needed to render Toast components */}
            <ToastContainer position="top-end" className="p-1">
                <Toast show={showToast} onClose={() => setShowToast(false)} bg={isError ? "danger" : "success"} delay={3000} autohide>
                    <Toast.Body>{message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default App;
