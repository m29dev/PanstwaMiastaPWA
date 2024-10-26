import React from 'react';
import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const GamePage = () => {
    // const navigate = useNavigate()

    const { id } = useParams(); // Extracts the ID from the URL

    return (
        <>
            <Navbar></Navbar>
            <div>
                <h1>Game Page</h1>
                <p>Welcome to the Game Page!</p>
                <h2>{id}</h2>
            </div>
        </>

    );
};

export default GamePage;
