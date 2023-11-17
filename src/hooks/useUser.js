import { useEffect, useState } from "react"
import axios from "axios"
export default function useUser() {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const getUser = async () => {
            const { data } = await axios.get("/api/user")

            setUser(data)
        }
        getUser()
    }, [])
    return { user }
}