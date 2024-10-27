import { useEffect, useState } from "react"
import supabase from '../supabaseClient'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import CardBox from "../components/CardBox";
import { getUserInfo } from "../services/authService";

function RoomsPage() {
    const navigate = useNavigate()
    const [rooms, setRooms] = useState([])
    const [name, setName] = useState([])

    const handleCreateRoom = async () => {
        try {
            if (name.length < 3) return alert('room name must contain at least 3 characters')

            const user = await getUserInfo()

            const playerObject = {
                id: user.id,
                name: user.name,
                points: 0,
                answers: [],
                ready: false,
            }

            const dataRoom = await supabase
                .from('rooms')
                .insert([
                    { name: name, player0: playerObject }
                ])
                .select()

            if (!dataRoom) return alert('error, could not create a room')

            console.log(23, dataRoom.data[0])
            navigate(`/game/${dataRoom.data[0].id}`)

        } catch (err) {
            console.log(err)
        }
    }

    const getRooms = async () => {
        const { data } = await supabase.from('rooms').select()

        setRooms(data)
    }

    // Listen to inserts
    supabase
        .channel('rooms')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rooms' }, getRooms)
        .subscribe()

    useEffect(() => {
        getRooms()
    }, [])

    return (
        <>
            <Navbar></Navbar>

            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                    required
                />

                <button type="submit" onClick={handleCreateRoom} style={styles.button}>
                    Create
                </button>
            </div>

            <div style={styles.container}>
                {rooms.map((room, index) => (
                    <CardBox
                        key={index}
                        title={room.name}
                        id={room.id}
                    />
                ))}
            </div>
        </>

    )
}

const styles = {
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
        backgroundColor: '#f4f4f9',
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
}

export default RoomsPage
