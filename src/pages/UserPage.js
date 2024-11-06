import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import {
    getUserData,
    getUserInfo,
    signOut,
    userAvatarUpdate,
} from '../services/authService'
import { useNavigate, useParams } from 'react-router-dom'
import supabase from '../supabaseClient'

const UserPage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [user, setUser] = useState([])

    const handleSignOut = () => {
        signOut()
        navigate('/auth')
    }

    const [avatar, setAvatar] = useState()
    const [avatarData, setAvatarData] = useState()

    const handleAvatarChange = (event) => {
        console.log('AVATAR INFO: ', Date.now(), event.target.files[0])

        setAvatarData(event.target.files[0])
        const objectUrl = URL.createObjectURL(event.target.files[0])
        setAvatar(objectUrl)
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

    const handleSave = async () => {
        try {
            // check if new image
            console.log('saving the changes: ', avatar)

            // Upload the image to Supabase Storage
            const res = await supabase.storage
                .from('icons') // 'images' is your storage bucket name
                .upload(`${Date.now()}.${avatarData.name}`, avatarData)

            if (!res) return console.log('upload error')
            if (res?.error) return console.log(res?.error)

            console.log('UPLOADED AVATAR: ', res?.data?.path)
            // update userInfo
            const update = await userAvatarUpdate(res?.data?.path)

            if (update) handleRenderUser()
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

                <div style={styles.avatarBox}>
                    <label for="upload">
                        <img
                            src={
                                avatar
                                    ? avatar
                                    : `https://xegmsphprxsopaotcvpj.supabase.co/storage/v1/object/public/icons/${user?.avatar}`
                            } // Placeholder for account icon
                            alt="Account Icon"
                            style={styles.icon}
                        />

                        <input
                            accept="image/*"
                            id="upload"
                            type="file"
                            capture="environment"
                            style={styles.hidden}
                            onChange={handleAvatarChange}
                        />
                    </label>
                </div>
            </div>

            <div style={styles.containerPanel}>
                <div style={styles.controlPanel}>
                    <button style={styles.buttonPanel} onClick={handleSave}>
                        Save
                    </button>
                    <button style={styles.buttonPanel} onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    )
}

const styles = {
    containerPanel: {
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

    buttonPanel: {
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

    avatarBox: {
        height: '100px',
        width: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    icon: {
        height: '64px',
        width: '64px',
        borderRadius: '50%',
    },

    hidden: { display: 'none' },

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
        // minHeight: 'calc(100vh - 60px)',
        minHeight: 'calc(100vh - 150px - 60px)',
        height: '100%',
        // maxHeight: 'calc(100vh - 60px)',
        textAlign: 'center',
        // backgroundColor: '#f4f4f9',
        fontFamily: 'Arial, sans-serif',
        // overflowY: 'auto', // Enable vertical scroll
        flex: 1,
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

    label: {
        display: 'block',
        marginBottom: '5px',
    },
}

export default UserPage
