import { useEffect, useState } from "react";
import supabase from './supabaseClient'

function App() {
  const [rooms, setRooms] = useState([]);

  // Create a function to handle inserts
  const handleInserts = (payload) => {
    console.log('Change received!', payload)
    setRooms(payload)
  }
  // Listen to inserts
  supabase
    .channel('rooms')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rooms' }, handleInserts)
    .subscribe()

  useEffect(() => {
    getCountries()
  }, [])

  const getCountries = async () => {
    const { data } = await supabase.from('rooms').select()
    setRooms(data)
  }

  return (
    <ul>
      {rooms.map((country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  )
}

export default App
