import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getUserData, getUserInfo, signOut } from '../services/authService'
import { useNavigate, useParams } from 'react-router-dom'

const UserPage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [user, setUser] = useState([])

    const handleSubmit = () => {
        signOut()
        navigate('/auth')
    }

    const [avatar, setAvatar] = useState()

    const handleAvatarChange = (event) => {
        const objectUrl = URL.createObjectURL(event.target.files[0])
        setAvatar(objectUrl)

        console.log(objectUrl)
    }

    const handleRenderUser = async () => {
        try {
            const { id } = params
            console.log(17, id)

            const res = await getUserData(id)
            console.log(res)

            setUser(res)
        } catch (err) {
            console.log(err)
        }
    }

    const handleChangeAvatar = async () => {
        try {
            console.log('changing avatar')
        } catch (err) {
            console.log(err)
        }
    }

    const handleProtectedRoute = async () => {
        try {
            const user = await getUserInfo()
            if (!user) return navigate('/auth')
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        handleProtectedRoute()
        handleRenderUser()
    }, [])

    return (
        <>
            <Navbar></Navbar>
            <div style={styles.container}>
                <h1>id: {user.id}</h1>
                <h1>user: {user.name}</h1>

                <label for="upload">
                    <div style={styles.avatarBox}>
                        <img
                            src={
                                avatar
                                    ? avatar
                                    : `https://xegmsphprxsopaotcvpj.supabase.co/storage/v1/object/public/icons/${user?.avatar}`
                            } // Placeholder for account icon
                            alt="Account Icon"
                            style={styles.icon}
                            onClick={handleChangeAvatar}
                        />
                    </div>

                    <input
                        accept="image/*"
                        id="upload"
                        type="file"
                        capture="environment"
                        style={styles.hidden}
                        onChange={handleAvatarChange}
                    />
                </label>

                <button
                    type="submit"
                    style={styles.button}
                    onClick={handleSubmit}
                >
                    SignOut
                </button>
            </div>
        </>
    )
}

const styles = {
    avatarBox: {
        height: '100px',
        width: '100px',
    },

    hidden: { display: 'none' },

    iBox: {
        display: 'flex',
        flexDirection: 'row',

        alignItems: 'center',
        border: '2px solid #ccc',
        borderRadius: '25px',
        // padding: '5px',
        // width: '300px',
        overflow: 'hidden',
        margin: 'auto',
        marginBottom: '30px',
        flex: 1,
        width: '100%',
    },

    roundedInput: {
        border: 'none',
        outline: 'none',
        flexGrow: 1,
        padding: '10px 10px',
        borderRadius: '25px 0 0 25px' /* Rounded on the left */,
    },

    submitButton: {
        backgroundColor: '#007bff' /* Button color */,
        color: 'white',
        border: 'none',
        borderRadius: '25px' /* Rounded on the right */,
        // padding: '5px 15px',
        height: '35px',
        width: '40px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconBox: {
        height: '30px',
        width: '30px',
    },

    container: {
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        minHeight: 'calc(100vh - 60px)',
        height: '100%',
        // maxHeight: 'calc(100vh - 60px)',
        textAlign: 'center',
        // backgroundColor: '#f4f4f9',
        fontFamily: 'Arial, sans-serif',
        // overflowY: 'auto', // Enable vertical scroll
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

    inputContainer: {
        marginBottom: '15px',
        width: '80%',
        margin: 'auto',
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
        justifyContent: 'space-between',
    },
}

export default UserPage
