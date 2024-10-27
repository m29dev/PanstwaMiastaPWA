import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getUserData, signOut } from '../services/authService'
import { useNavigate, useParams } from 'react-router-dom'

const UserPage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [user, setUser] = useState([])

    const handleSubmit = () => {
        signOut()
        navigate('/auth')
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

    useEffect(() => {
        handleRenderUser()
    }, [])

    return (
        <>
            <Navbar></Navbar>
            <div>
                <h1>id: {user.id}</h1>
                <h1>user: {user.name}</h1>
                <button type="submit" onClick={handleSubmit}>
                    SignOut
                </button>
            </div>
        </>
    )
}

export default UserPage
