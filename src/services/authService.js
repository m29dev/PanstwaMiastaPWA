import supabase from '../supabaseClient'

export const getUserInfo = async () => {
    try {
        const data = localStorage.getItem('userInfo')
        const user = JSON.parse(data)

        if (!user) return false

        return user
    } catch (err) {
        console.log(err)
    }
}

export const getUserData = async (id) => {
    try {
        const dataUser = await supabase
            .from('users')
            .select()
            .eq('id', +id)
            .single()

        if (!dataUser) return

        const userObject = {
            id: dataUser.data.id,
            name: dataUser.data.name,
            avatar: dataUser.data.avatar,
        }

        return userObject
    } catch (err) {
        console.log(err)
    }
}

export const signUp = async (name, password, avatar) => {
    try {
        // check if name already exists
        const dataCheck = await supabase
            .from('users') // Change 'users' to your table name
            .select()
            .eq('name', name)

        if (dataCheck) return alert('user already exists')

        // create an user
        const dataUser = await supabase
            .from('users') // Change 'users' to your table name
            .insert([
                { name: name, password: password, avatar: avatar }, // Adjust object keys to match your table columns
            ])
            .select()

        console.log(1, dataUser)

        if (!dataUser) return alert('error, please try again')

        console.log('Successful SignUp: ', dataUser.data)

        const userObject = {
            id: dataUser.data[0].id,
            name: dataUser.data[0].name,
        }

        localStorage.setItem('userInfo', JSON.stringify(userObject))
        return true
    } catch (err) {
        console.log(err)
    }
}

export const signIn = async (name, password) => {
    try {
        // check for user
        const dataUser = await supabase
            .from('users') // Change 'users' to your table name
            .select('*')
            .eq('name', name)

        console.log(1, dataUser)

        if (!dataUser) return { error: 'wrong username or password' }
        if (dataUser.data.length < 1)
            return { error: 'wrong username or password' }
        if (dataUser.data[0].password !== password)
            return { error: 'wrong username or password' }

        console.log('Successful SignIn: ', dataUser)

        const userObject = {
            id: dataUser.data[0].id,
            name: dataUser.data[0].name,
            avatar: dataUser.data[0].avatar,
        }

        localStorage.setItem('userInfo', JSON.stringify(userObject))
        return dataUser
    } catch (err) {
        console.log(err)
    }
}

export const signOut = async () => {
    try {
        localStorage.removeItem('userInfo')
        alert(`You've Log Out`)
    } catch (err) {
        console.log(err)
    }
}
