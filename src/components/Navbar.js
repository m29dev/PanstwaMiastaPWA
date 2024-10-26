import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [currentPath, setCurrentPath] = useState(null)

    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    useEffect(() => {
        console.log(location)
        setCurrentPath(location.pathname)
    }, [location])

    return (
        <nav style={styles.navbar}>
            {currentPath === '/' ? (
                <div style={styles.flexBox}></div>
            ) : (
                <button style={styles.backButton} onClick={handleGoBack}>
                    Go Back
                </button>
            )}

            <div style={styles.accountIcon}>
                <img
                    src="https://via.placeholder.com/30" // Placeholder for account icon
                    alt="Account Icon"
                    style={styles.icon}
                />
            </div>
        </nav>
    );
};

const styles = {
    flexBox: {
        flex: 1
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        height: '40px'
    },
    backButton: {
        padding: '8px 16px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#0056b3',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    accountIcon: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        width: '30px',
        height: '30px',
        borderRadius: '50%', // To make it circular
    },
};

export default Navbar;
