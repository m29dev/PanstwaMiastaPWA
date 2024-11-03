import React, { useEffect, useState } from 'react'
import supabase from "../supabaseClient"
import { useParams } from 'react-router-dom';
import { getUserInfo } from '../services/authService';
import { fetchGameInfo, getGameInfo, restartGame, updateGameInfo, updateGameInfoReview } from '../services/gameService';
import Navbar from '../components/Navbar';
import NavbarGame from '../components/NavbarGame';

const GamePage = () => {
    const { id } = useParams()
    const [panstwo, setPanstwo] = useState('')
    const [miasto, setMiasto] = useState('')
    const [imie, setImie] = useState('')
    const [marka, setMarka] = useState('')

    const [panstwoBox, setPanstwoBox] = useState(true)
    const [miastoBox, setMiastoBox] = useState(true)
    const [imieBox, setImieBox] = useState(true)
    const [markaBox, setMarkaBox] = useState(true)

    const [userInfo, setUserInfo] = useState('')
    const [gameInfo, setGameInfo] = useState('')
    const [displayData, setDisplayData] = useState({})
    const [check, setCheck] = useState(false)
    const [gameStatus, setGameStatus] = useState(true)

    const handleNewGame = async () => {
        try {
            const res = await restartGame(id)
            console.log(res)
            if (res) {
                setGameStatus(true)
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Simple function to log any messages we receive
    const messageReceived = async (payload) => {
        console.log(payload)
        const res = await updateGameInfo(id, { panstwo, miasto, imie, marka }, true)

        // clean
        setPanstwo('')
        setMiasto('')
        setImie('')
        setMarka('')

        if (!res) return console.log('could not send answers')
        // fetchGameInfo()
    }

    const channel = supabase.channel(`room${id}`)

    channel
        .on(
            'broadcast',
            { event: 'onSendAnswers' },
            (payload) => messageReceived(payload)
        )
        .subscribe()

    const onGameInit = async () => {
        try {
            const user = await getUserInfo()
            setUserInfo(user)

            const game = await fetchGameInfo(id)
            if (!game.started) return setGameStatus(false)

            console.log(24, user)
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async () => {
        console.log('submit')
        const ansObject = {
            panstwo, miasto, imie, marka
        }

        const res = await updateGameInfo(id, ansObject, false)
        if (!res) return console.log('could not sent answers')

        // Send a message once the client is subscribed
        channel.send({
            type: 'broadcast',
            event: 'onSendAnswers',
            payload: { message: `${userInfo.name} has sent data. Init same for current player` },
        })

        // clean
        setPanstwo('')
        setMiasto('')
        setImie('')
        setMarka('')

        console.log(res)
    }

    const handleSubmitReview = async () => {
        console.log('submit review')

        let points = 0
        if (panstwoBox) points += 10
        if (miastoBox) points += 10
        if (imieBox) points += 10
        if (markaBox) points += 10

        const res = await updateGameInfoReview(id, points)
        console.log(res)
        // 
    }

    const onGameUpdate = async () => {
        // GAME
        const game = await fetchGameInfo(id)
        if (!game) return console.log('could not fetch game info')

        const gameInfo = await getGameInfo()
        setGameInfo(gameInfo)
    }

    // Listen to inserts
    supabase
        .channel('rooms')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${id}` }, onGameUpdate)
        .subscribe()

    useEffect(() => {
        onGameInit()
        onGameUpdate()
    }, [])

    return (
        <>
            <NavbarGame></NavbarGame>

            {gameStatus && (
                <>
                    <div>
                        PTS: {gameInfo?.player0?.id === userInfo?.id ? gameInfo?.player0?.points : gameInfo?.player1?.points}
                    </div>
                    <div>
                        ROUND: {gameInfo?.round}/3
                    </div>

                    {!gameInfo?.review && (
                        <div style={styles.container}>
                            {/* panstwo */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Panstwo:</label>
                                <input
                                    type="text"
                                    value={panstwo}
                                    onChange={(e) => setPanstwo(e.target.value)}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            {/* miasto */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Miasto:</label>
                                <input
                                    type="text"
                                    value={miasto}
                                    onChange={(e) => setMiasto(e.target.value)}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            {/* imie */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Imie:</label>
                                <input
                                    type="text"
                                    value={imie}
                                    onChange={(e) => setImie(e.target.value)}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            {/* marka */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Marka:</label>
                                <input
                                    type="text"
                                    value={marka}
                                    onChange={(e) => setMarka(e.target.value)}
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.btnBox}>
                                <button type="submit" onClick={handleSubmit} style={styles.button}>
                                    CZAS STOP
                                </button>

                            </div>
                        </div>
                    )}

                    {gameInfo?.review && (
                        <div style={styles.container}>
                            {/* panstwo */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Panstwo:</label>
                                <p>{
                                    gameInfo?.player0?.id === userInfo?.id
                                        ?
                                        gameInfo?.player1?.answers?.panstwo
                                        :
                                        gameInfo?.player0?.answers?.panstwo
                                }
                                </p>
                                <input
                                    type="checkbox"
                                    checked={panstwoBox}
                                    onChange={() => setPanstwoBox((state) => !state)}
                                />
                            </div>

                            {/* miasto */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Miasto:</label>
                                <p>{
                                    gameInfo?.player0?.id === userInfo?.id
                                        ?
                                        gameInfo?.player1?.answers?.miasto
                                        :
                                        gameInfo?.player0?.answers?.miasto
                                }
                                </p>
                                <input
                                    type="checkbox"
                                    checked={miastoBox}
                                    onChange={() => setMiastoBox((state) => !state)}
                                />
                            </div>

                            {/* imie */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Imie:</label>
                                <p>{
                                    gameInfo?.player0?.id === userInfo?.id
                                        ?
                                        gameInfo?.player1?.answers?.imie
                                        :
                                        gameInfo?.player0?.answers?.imie
                                }
                                </p>
                                <input
                                    type="checkbox"
                                    checked={imieBox}
                                    onChange={() => setImieBox((state) => !state)}
                                />
                            </div>

                            {/* marka */}
                            <div style={styles.inputContainer}>
                                <label style={styles.label}>Marka:</label>
                                <p>{
                                    gameInfo?.player0?.id === userInfo?.id
                                        ?
                                        gameInfo?.player1?.answers?.marka
                                        :
                                        gameInfo?.player0?.answers?.marka
                                }
                                </p>
                                <input
                                    type="checkbox"
                                    checked={markaBox}
                                    onChange={() => setMarkaBox((state) => !state)}
                                />
                            </div>

                            <div style={styles.btnBox}>
                                <button type="submit" onClick={handleSubmitReview} style={styles.button}>
                                    WYŚLIJ OCENE
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}




            {!gameStatus && (
                <div>
                    <h3> Game Over!</h3>

                    <h1>
                        Player {gameInfo.player0.points > gameInfo.player1.points ? gameInfo.player0.name : gameInfo.player1.name} won!
                    </h1>


                    <p>Score: {gameInfo.player0.name}, {gameInfo.player0.points} pts : {gameInfo.player1.name}, {gameInfo.player1.points} pts</p>

                    <button onClick={handleNewGame}>New Game</button>
                </div>
            )}

        </>
    )
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f4f4f9',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginTop: '20px',
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

export default GamePage