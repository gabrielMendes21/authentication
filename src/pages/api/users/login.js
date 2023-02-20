import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query']
})

export default async function handler(req, res) {
    if (req.method === "POST") {
        const users = await prisma.user.findMany()
        const user = users.find(user => user.email == req.body.email)

        // Check is the user exists in database
        if (user == undefined) {
            res.send({
                message: "User not found"
            })
        } else {
            try {
                // Compare the encrypted password with the password sent by the user
                const passwordIsCorrect = await bcrypt.compare(req.body.password, user.password)
                if (passwordIsCorrect) {
                    // Create a new JSON Web Token with the user data and the secret key with an expiry date of 21 hours
                    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 * 60 * 21 })

                    res.send({
                        message: 'Welcome ' + user.email,
                        user,
                        'authorization-token': token
                    })
                } else {
                    res.send({
                        message: "Incorrect password"
                    })
                }
            } catch(err) {
                console.log(err)
                res.status(500).send()
            }
        }   
    }
}