import { useEffect, useState } from 'react'
import supabase from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CardBox from '../components/CardBox'
import { getUserInfo } from '../services/authService'
import { MdKeyboardArrowRight } from 'react-icons/md'

function RoomsPage() {
    const navigate = useNavigate()
    const [rooms, setRooms] = useState([])
    const [name, setName] = useState([])

    const handleCreateRoom = async () => {
        try {
            if (name.length < 3)
                return alert('room name must contain at least 3 characters')

            const user = await getUserInfo()

            const playerObject = {
                id: user.id,
                name: user.name,
                points: 0,
                answers: null,
                ready: false,
                avatar: user?.avatar,
            }

            const dataRoom = await supabase
                .from('rooms')
                .insert([{ name: name, player0: playerObject }])
                .select()

            if (!dataRoom) return alert('error, could not create a room')

            console.log(23, dataRoom.data[0])
            navigate(`/rooms/${dataRoom.data[0].id}`)
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
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'rooms' },
            getRooms
        )
        .subscribe()

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
        getRooms()
    }, [])

    return (
        <>
            <Navbar></Navbar>

            <div style={styles.container}>
                <div style={styles.iBox}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Create new game..."
                        style={styles.roundedInput}
                        required
                    />
                    <button
                        type="submit"
                        style={styles.submitButton}
                        onClick={handleCreateRoom}
                    >
                        <MdKeyboardArrowRight style={styles.iconBox} />
                    </button>
                </div>

                {rooms.map((room, index) => (
                    <CardBox key={index} title={room.name} id={room.id} />
                ))}
            </div>
        </>
    )
}

const styles = {
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

export default RoomsPage
