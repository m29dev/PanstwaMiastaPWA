import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo } from '../services/authService';
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

const NavbarGame = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [currentPath, setCurrentPath] = useState(null)

    const handleGoBack = () => {
        // if in game navigate to rooms
        navigate('/rooms'); // Navigate back to the previous page
    };

    const handleUserPage = async () => {
        const user = await getUserInfo()

        console.log(9, user)

        if (user)
            navigate(`/user/${user.id}`)
    }


    const [isUser, setIsUser] = useState(false)

    const handleUserCheck = async () => {
        try {
            const res = await getUserInfo()
            console.log(30, res)

            if (!res) return setIsUser(false)
            if (res) return setIsUser(true)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        console.log(location)
        setCurrentPath(location.pathname)

        handleUserCheck()
    }, [location])

    return (
        <nav style={styles.navbar}>
            {currentPath === '/' ? (
                <div style={styles.flexBox}></div>
            ) : (
                <FaRegArrowAltCircleLeft style={styles.backButton} onClick={handleGoBack} />
            )}

            {isUser ? (<div style={styles.accountIcon}>
                <img
                    src="https://via.placeholder.com/30" // Placeholder for account icon
                    alt="Account Icon"
                    style={styles.icon}
                    onClick={handleUserPage}
                />
            </div>) : (<div style={styles.flexBox}></div>)}

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
        borderRadius: '0px 0px 25px 25px',
        color: '#fff',
        height: '40px'
    },
    backButton: {
        // padding: '8px 16px',
        // fontSize: '16px',
        // color: '#fff',
        // backgroundColor: '#0056b3',
        // border: 'none',
        // borderRadius: '5px',
        cursor: 'pointer',
        // transition: 'background-color 0.3s',
        height: '30px',
        width: '30px'
    },
    accountIcon: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        width: '30px',
        height: '30px',
        borderRadius: '50%', // To make it circular
    },
}

export default NavbarGame
