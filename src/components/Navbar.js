import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getUserInfo } from '../services/authService'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [currentPath, setCurrentPath] = useState(null)

    const handleGoBack = () => {
        const currLoc = location.pathname
        const arr = currLoc.split('/')
        arr.pop()
        let newLocation = arr.join('/')

        console.log(arr)

        if (currLoc.slice(-4) === 'game') return navigate('/rooms')
        if (arr?.[1] === 'user') return navigate('/')
        if (newLocation === '') return navigate('/')
        return navigate(newLocation)
    }

    const handleUserPage = async () => {
        const user = await getUserInfo()

        console.log(9, user)

        if (user) navigate(`/user/${user.id}`)
    }

    const [user, setUser] = useState(false)

    const handleSignIn = async () => {
        navigate('/auth')
    }

    const handleUserCheck = async () => {
        try {
            const res = await getUserInfo()
            console.log(30, res.avatar)

            if (!res) return setUser(false)
            if (res) setUser(res)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        handleUserCheck()
    }, [])

    return (
        <nav style={styles.navbar}>
            {/* BTN BACK */}
            {currentPath === '/' ? (
                <div style={styles.flexBox}></div>
            ) : (
                <div style={styles.btnBoxLeft}>
                    <FaRegArrowAltCircleLeft
                        style={styles.backButton}
                        onClick={handleGoBack}
                    />
                </div>
            )}

            {/* APP ICON IMG */}
            <img
                src="https://xegmsphprxsopaotcvpj.supabase.co/storage/v1/object/public/icons/icon.png.png" // Placeholder for account icon
                alt="APP Icon"
                style={styles.iconImg}
                onClick={() => navigate('/')}
            ></img>

            {/* USER ICON IMG / SIGN IN BTN */}
            {user ? (
                <div style={styles.btnBoxRight}>
                    <img
                        src={`https://xegmsphprxsopaotcvpj.supabase.co/storage/v1/object/public/icons/${user?.avatar}`} // Placeholder for account icon
                        alt="Account Icon"
                        style={styles.icon}
                        onClick={handleUserPage}
                    />
                </div>
            ) : (
                <div style={styles.btnBoxRight}>
                    <button style={styles.button} onClick={handleSignIn}>
                        Sign In
                    </button>
                </div>
            )}
        </nav>
    )
}

const styles = {
    btnBoxRight: {
        flex: 1,
        display: 'flex',
        justifyContent: 'end',
    },

    btnBoxLeft: {
        flex: 1,
        display: 'flex',
        justifyContent: 'start',
    },

    button: {
        // width: '35px',
        height: '35px',
        // padding: '0.75em 1.5em',
        fontSize: '1em',
        color: '#000000',
        backgroundColor: '#EEEEEE',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },

    iconImg: {
        height: '80px',
        width: '80px',
        marginTop: '23px',
        // webkitBoxShadow: '8px 8px 24px 0px rgba(66, 68, 90, 1)',
        // mozBoxShadow: ' 8px 8px 24px 0px rgba(66, 68, 90, 1)',
        // boxShadow: '8px 8px 24px 0px rgba(66, 68, 90, 1)',
    },

    flexBox: {
        flex: 1,
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        height: '40px',
        borderRadius: '0px 0px 35px 35px',

        WebkitBoxShadow: '0px 8px 24px 0px rgba(40, 68, 90, 1)',
        MozBoxShadow: '0px 8px 24px 0px rgba(40, 68, 90, 1)',
        boxShadow: '0px 8px 24px 0px rgba(40, 68, 90, 1)',

        // webkitBoxShadow: '0px 8px 24px 0px rgba(218, 218, 218, 1)',
        // mozBoxShadow: '0px 8px 24px 0px rgba(218, 218, 218, 1)',
        // boxShadow: '0px 8px 24px 0px rgba(218, 218, 218, 1)',
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
        width: '30px',
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

export default Navbar
