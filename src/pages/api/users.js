import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// http://localhost:3000/users
export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const users = await prisma.user.findMany()
            // Return the user data if the email received in request matches some email in the database
            const user = users.find(user => user.email == req.body.email)
    
            // Check is the email already exists
            if (user) {
                res.status(400).send("This email is already being used")
            } else {
                // Encrypt the password
                const password = req.body.password.toString()
                const hashedPassword = await bcrypt.hash(password, 10)
    
                // New user data received in request
                const newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword 
                }
                
                // Send this new user data to database
                await prisma.user.create({
                    data: newUser
                })
    
                res.status(201).send('User has been created successfully')
            }
        } catch(err) {
            res.status(500).send() 
            console.log(err)
        }
    }
}