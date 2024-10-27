import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import supabase from "../supabaseClient"
import { getUserInfo } from '../services/authService';


const GamePage = () => {
    // const navigate = useNavigate()

    const { id } = useParams()
    const [user, setUser] = useState(null)
    const [game, setGame] = useState([])

    const joinGame = async () => {
        try {
            const user = await getUserInfo()
            const gameObject = await supabase
                .from('rooms')
                .select()
                .eq('id', id)

            if (!gameObject) return
            const game = gameObject?.data[0]

            if (!game) return

            // check if already a player
            if (game?.player0?.id === user.id) return console.log('player0 rejoined')
            if (game?.player1?.id === user.id) return console.log('player1 rejoined')

            // check if can join as a new player
            if (game.player1) return console.log('room already full')

            const playerObject = {
                id: user.id,
                name: user.name,
                points: 0,
                answers: [],
                ready: false,
            }

            const gameUpdate = await supabase
                .from('rooms')
                .update([
                    { player1: playerObject }
                ])
                .eq('id', id)
                .select()

            if (gameUpdate) console.log('player1 has joined the game')
            getGameInfo()
        } catch (err) {
            console.log(err)
        }
    }

    const handlePlayerReady = async () => {
        try {
            console.log('switch ready')

            const user = await getUserInfo()

            const data = await supabase
                .from('rooms')
                .select()
                .eq('id', id)

            const game = data.data[0]

            const updatePlayer1 = async () => {
                try {
                    game.player1.ready = !game.player1.ready
                    console.log('UPDATING PLAYER1 ', game.player1)
                    const update1 = await supabase
                        .from('rooms')
                        .update({ player1: game.player1 })
                        .eq('id', id)
                        .select()

                    if (!update1) return console.log('error')
                } catch (err) {
                    console.log(err)
                }
            }

            const updatePlayer0 = async () => {
                try {
                    game.player0.ready = !game.player0.ready
                    console.log('UPDATING PLAYER0', game.player0)

                    const update0 = await supabase
                        .from('rooms')
                        .update({ player0: game.player0 })
                        .eq('id', id)
                        .select()

                    if (!update0) return console.log('error')
                } catch (err) {
                    console.log(err)
                }
            }

            // check if player0 or player1
            if (game.player0.id === user.id) updatePlayer0()

            // check if player0 or player1
            if (game.player1.id === user.id) updatePlayer1()

            // getGameInfo()
        } catch (err) {
            console.log(err)
        }
    }

    const getGameInfo = async () => {
        try {
            const data = await supabase
                .from('rooms')
                .select()
                .eq('id', id)

            const dataGame = data.data[0]
            setGame(dataGame)

            // check if ready
            if (dataGame.player0.ready && dataGame.player1.ready) {
                console.log('START THE GAME')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getUser = async () => {
        try {
            const user = await getUserInfo()
            setUser(user)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUser()
        getGameInfo()
        joinGame()
    }, [])

    const gameUpdate = () => {
        console.log('101 UPDATE')
        getGameInfo()
    }

    // Listen to inserts
    supabase
        .channel('rooms')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${id}` }, gameUpdate)
        .subscribe()

    return (
        <>
            <Navbar></Navbar>
            {/* <div>
                <h1>Game Page</h1>
                <p>Welcome to the Game Page!</p>
                <h2>{id}</h2>
            </div> */}

            <div style={styles.pageContainer}>
                {/* Player 1 Card */}
                {game.player0 ?
                    (
                        <div style={styles.playerCard}>
                            <h2 style={styles.playerName}>{game?.player0?.name}</h2>

                            {game?.player0?.id === user?.id && !game?.player0?.ready && (
                                <button onClick={handlePlayerReady}>Ready</button>
                            )}
                        </div>
                    )
                    :
                    (
                        <div style={styles.playerCard}>
                            <h2 style={styles.playerName}>Waiting for a player to join</h2>
                        </div>
                    )
                }

                {/* Player 1 Card */}
                {game.player1 ?
                    (<div style={styles.playerCard}>
                        <h2 style={styles.playerName}>{game?.player1?.name}</h2>

                        {game?.player1?.id === user?.id && !game?.player1?.ready && (
                            <button onClick={handlePlayerReady}>Ready</button>
                        )}
                    </div>)
                    :
                    (<div style={styles.playerCard}>
                        <h2 style={styles.playerName}>Waiting for a player to join</h2>
                    </div>)}

            </div>
        </>
    )
}

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        // padding: '20px',
        backgroundColor: '#f4f4f8',
        height: 'calc(100vh - 60px)',
        maxHeight: 'calc(100vh - 60px)'
    },

    playerCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#eef',
        borderRadius: '8px',
        width: '80%',
        textAlign: 'center',
        flex: 1,
    },
    playerName: {
        fontSize: '1.5rem',
        marginBottom: '10px',
    },
    matchDetails: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#333',
    },
};

export default GamePage
