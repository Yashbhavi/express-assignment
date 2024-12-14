import React, { useState } from 'react';
import axios from 'axios';
import { notification } from 'antd'; // Import notification from Ant Design
import './App.css';

function App() {
    const [message, setMessage] = useState('');

    const handleClick = async (button) => {
        setMessage(''); // Clear previous message
        try {
            const response = await axios.post('https://express-app-160811f-395048402555.asia-south1.run.app/click', { button }, {
                headers: {
                    authorization: `Bearer {idToken}`, // Replace {idToken} with the actual token
                    'Content-Type': 'application/json',
                },
            });

            // Show success notification
            notification.success({
                message: 'Success',
                description: response.data.message, // Display message from the response
                placement: 'top', // Notification position at the top
            });

        } catch (error) {
            if (error.response) {
                // Show error notification
                notification.error({
                    message: 'Error',
                    description: error.response.data.message || 'Rate limit reached',
                    placement: 'top', // Notification position at the top
                });
            } else {
                // Show generic error notification
                notification.error({
                    message: 'Error',
                    description: 'An error occurred. Please try again.',
                    placement: 'top', // Notification position at the top
                });
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Click the Button</h1>
                <div className="buttons">
                    <button className="blue" onClick={() => handleClick('blue')}>Blue Button</button>
                    <button className="red" onClick={() => handleClick('red')}>Red Button</button>
                </div>
            </header>
        </div>
    );
}

export default App;
