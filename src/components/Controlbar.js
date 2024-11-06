import React from 'react'
import { signOut } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const Controlbar = () => {
    const navigate = useNavigate()

    const handleSave = () => {
        console.log('saving changes')
    }

    const handleSignOut = () => {
        signOut()
        navigate('/auth')
    }

    return (
        <div style={styles.container}>
            <div style={styles.controlPanel}>
                <button style={styles.button} onClick={handleSave}>
                    Save
                </button>
                <button style={styles.button} onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        </div>
    )
}

const styles = {
    container: {
        width: '100%',
        height: '90px',
        // padding: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
    },

    controlPanel: {
        width: '80%',
        height: '50px',
        borderRadius: '50px',
        backgroundColor: '#047cfc',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    button: {
        // width: '35px',
        height: '35px',
        // padding: '0.75em 1.5em',
        fontSize: '1em',
        backgroundColor: '#0471f1',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        flex: 1,
        marginLeft: '10px',
        marginRight: '10px',
    },
}

export default Controlbar
