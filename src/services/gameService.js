import supabase from '../supabaseClient'
import { getUserInfo } from './authService'

export const getGameInfo = async () => {
    try {
        const data = localStorage.getItem('gameInfo')
        const game = JSON.parse(data)
        return game
    } catch (err) {
        console.log(err)
    }
}

export const fetchGameInfo = async (id) => {
    try {
        // GAME
        const gameData = await supabase.from('rooms').select().eq('id', id)

        if (!gameData) return console.log('could not fetch game data')
        const game = gameData?.data?.[0]

        const gameObject = {
            id: game.id,
            name: game.name,
            started: game.started,
            player0: game.player0,
            player1: game.player1,
            round: game.round,
            review: game.review,
        }

        localStorage.setItem('gameInfo', JSON.stringify(gameObject))
        return true
    } catch (err) {
        console.log(err)
    }
}

export const updateGameInfo = async (id, player_data, rev) => {
    try {
        const user = await getUserInfo()
        const game = await getGameInfo()

        // player0
        if (game.player0.id === user.id) {
            game.player0.answers = player_data

            const gameData = await supabase
                .from('rooms')
                .update([{ player0: game.player0, review: rev }])
                .eq('id', id)
                .select()

            if (!gameData) return console.log('could not fetch game data')
            const res = gameData?.data?.[0]
            localStorage.setItem('gameInfo', JSON.stringify(res))
        }

        // player1
        if (game.player1.id === user.id) {
            game.player1.answers = player_data

            const gameData = await supabase
                .from('rooms')
                .update([{ player1: game.player1, review: rev }])
                .eq('id', id)
                .select()

            if (!gameData) return console.log('could not fetch game data')
            const res = gameData?.data?.[0]
            localStorage.setItem('gameInfo', JSON.stringify(res))
        }

        return true
    } catch (err) {
        console.log(err)
    }
}

export const updateGameInfoReview = async (id, points) => {
    try {
        const user = await getUserInfo()
        const game = await getGameInfo()

        // player0 (reviewed points for player1)
        if (game.player0.id === user.id) {
            game.player1.answers = null
            game.player1.points = +game.player1.points + +points

            console.log(
                '0: ',
                game.player0.answers,
                '1: ',
                game.player1.answers
            )
            let rev
            if (
                game.player0.answers === null &&
                game.player1.answers === null
            ) {
                rev = false
                game.round = game.round + 1
            }

            if (game.round > 3) {
                game.started = 2
            }

            const gameData = await supabase
                .from('rooms')
                .update([
                    {
                        player1: game.player1,
                        review: rev,
                        round: game.round,
                        started: game.started,
                    },
                ])
                .eq('id', id)
                .select()

            if (!gameData) return console.log('could not fetch game data')
            const res = gameData?.data?.[0]
            console.log(res)
        }

        // player1 (reviewed points for player0)
        if (game.player1.id === user.id) {
            game.player0.answers = null
            game.player0.points = +game.player0.points + +points

            console.log(
                '0: ',
                game.player0.answers,
                '1: ',
                game.player1.answers
            )
            let rev
            if (
                game.player0.answers === null &&
                game.player1.answers === null
            ) {
                rev = false
                game.round = game.round + 1
            }

            if (game.round > 3) {
                game.started = false
            }

            const gameData = await supabase
                .from('rooms')
                .update([
                    {
                        player0: game.player0,
                        review: rev,
                        round: game.round,
                        started: game.started,
                    },
                ])
                .eq('id', id)
                .select()

            if (!gameData) return console.log('could not fetch game data')
            const res = gameData?.data?.[0]
            console.log(res)
        }

        return true
    } catch (err) {
        console.log(err)
    }
}

export const restartGame = async (id) => {
    try {
        // const user = await getUserInfo()
        const game = await getGameInfo()

        game.player0 = { id: game.player0.id, name: game.player0.name }
        game.player1 = { id: game.player1.id, name: game.player1.name }
        game.started = true
        game.round = 1
        game.review = false

        const gameData = await supabase
            .from('rooms')
            .update([
                {
                    player0: game.player0,
                    player1: game.player1,
                    review: game.review,
                    round: game.round,
                    started: game.started,
                },
            ])
            .eq('id', id)
            .select()

        if (!gameData) return console.log('could not restart the game')
        return true
    } catch (err) {
        console.log(err)
    }
}
