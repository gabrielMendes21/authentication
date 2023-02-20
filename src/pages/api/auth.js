import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
    if (req.method === "GET") {
        // JSON Web Token received by url
        const tokenValue = req.query.token

        // Check if the token is valid
        jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403).send()
            }
            res.send(user)
        })
    }
}