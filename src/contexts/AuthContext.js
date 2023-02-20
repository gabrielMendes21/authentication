import { createContext, useEffect, useState } from 'react'
import { parseCookies, setCookie } from 'nookies'
import axios from 'axios'
import Router from 'next/router'

export const AuthContext = createContext({})

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const { 'auth-token': token } = parseCookies()

        const signUpURLPathName = "/createNewAccount"
        const signInURLPathName = "/login"

        if (Router.pathname != signUpURLPathName) {
            if (token) {
                axios(`../api/auth?token=${token}`)
                    .then(response => setUser(response.data))
                    .catch(err => console.log(err))
            } else {
                Router.push('/login')
            }
        } if (Router.pathname == signInURLPathName) {
            if (token) {
                console.log("Oa")
                Router.push('/')
            }
        }
    }, [])

    async function signIn({ email, password }) {
        try {
            const response = await axios.post(`../api/users/login`, {
                email, password
            })
            const data = await response.data
            const { 'authorization-token': token, user } = data

            if (!token) {
                alert(response.data.message)
            } else {
                setCookie(undefined, 'auth-token', token, {
                    maxAge: 60 * 60 * 21
                })

                setUser(user)

                Router.push('/')
            }
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <AuthContext.Provider value={{ user, signIn, }}>
            { children }
        </AuthContext.Provider>
    )
}