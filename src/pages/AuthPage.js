import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getUserInfo, signIn, signUp } from '../services/authService'
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [auth, setAuth] = useState(true)

    const userInfoCheck = async () => {
        try {
            console.log('CHECKING FOR USER INFO...')
            const userInfo = await getUserInfo()
            console.log(userInfo)

            if (!userInfo) return

            navigate('/rooms')
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        userInfoCheck()
    }, [])

    const switchAuth = () => {
        setAuth(state => !state)

        // Reset fields
        setName('')
        setPassword('')
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !password) {
            setError('Please fill in all fields.')
            return
        }

        if (auth) {
            const res = await signIn(name, password)

            // Reset fields
            setName('')
            setPassword('')
            setError('')

            if (!res) return setError('404')
            if (res?.error) return setError(res.error)

            userInfoCheck()

            console.log('SignIn with', { name, password })
        }

        if (!auth) {
            const res = await signUp(name, password)

            // Reset fields
            setName('')
            setPassword('')
            setError('')

            if (res) userInfoCheck()
            console.log('SignUp with', { name, password })
        }

        // Reset fields
        setName('')
        setPassword('')
        setError('')
    }

    return (
        <>
            <Navbar></Navbar>
            <div style={styles.container}>
                {auth ?
                    (
                        <h1>
                            Sign In
                        </h1>
                    )
                    :
                    (
                        <h1>
                            Create an account
                        </h1>
                    )
                }

                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.inputContainer}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                {auth && (
                    <div style={styles.btnBox}>
                        <button type="submit" onClick={handleSubmit} style={styles.button}>
                            Sign In
                        </button>

                        <button onClick={switchAuth} style={styles.buttonSecond}>
                            Don't have an account yet?
                        </button>
                    </div>
                )}

                {!auth && (
                    <div style={styles.btnBox}>
                        <button type="submit" onClick={handleSubmit} style={styles.button}>
                            Sign Up
                        </button>

                        <button onClick={switchAuth} style={styles.buttonSecond}>
                            have an account already?
                        </button>
                    </div>
                )}

            </div>
        </>
    );
};

const styles = {
    container: {
        padding: '40px',
        // backgroundColor: '#f4f4f9',
        // border: '1px solid #ccc',
        borderRadius: '5px',
        marginTop: '40px',
        margin: 'auto',
        height: '100%'
    },
    inputContainer: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        height: '30px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    btnBox: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonSecond: {
        padding: '10px 15px',
        backgroundColor: '#777777',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    error: {
        color: 'red',
    },
};

export default SignIn;