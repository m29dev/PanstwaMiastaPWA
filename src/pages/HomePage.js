import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const HomePage = () => {
    const navigate = useNavigate()

    const handlePlay = () => {
        navigate('/rooms')
        console.log('Play button clicked')
        // Implement play logic here, such as redirecting to the game or initializing it
    }

    return (
        <>
            <Navbar></Navbar>
            <div style={styles.container}>
                <h1 style={styles.title}>Panstwa Miasta</h1>
                <p style={styles.description}>
                    Welcome to the Panstwa Miasta game! Challenge your knowledge
                    of countries, cities, and more.
                </p>
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={handlePlay}>
                        Play
                    </button>
                </div>
            </div>
        </>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 60px)',
        textAlign: 'center',
        // backgroundColor: '#f4f4f9',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2.5em',
        color: '#333',
        marginBottom: '0.5em',
    },
    description: {
        fontSize: '1.2em',
        color: '#555',
        marginBottom: '2em',
    },
    buttonContainer: {
        display: 'flex',
        gap: '1em',
    },
    button: {
        padding: '0.75em 1.5em',
        fontSize: '1em',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
}

styles.button[':hover'] = {
    backgroundColor: '#0056b3',
}

export default HomePage
