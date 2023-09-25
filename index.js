const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const jwt = require('jsonwebtoken');
require('dotenv').config()
app.use(cors());
app.use(express.json())

const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'unauthorized access' });
    }
    // bearer token
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true, message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dkm5by0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const menuCollection = client.db('opulenza').collection('menu')
        const userCollection = client.db('opulenza').collection('users')

        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            if (user?.role !== 'admin') {
                return res.status(403).send({ error: true, message: 'forbidden message' });
            }
            next();
        }

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
        })

        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result)
        })

        app.post('/menu', async (req, res) => {
            const menu = req.body;
            console.log(menu);
            const result = await menuCollection.insertOne(menu);
            res.send(result)
        })

        app.get('/users', verifyAdmin, async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })

        app.post('/users', verifyAdmin, async (req, res) => {
            const user = req.body;

            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query)

            if (existingUser) {
                return res.send({ message: 'user already exist' })
            }
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.get('/users/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;

            if (req.decoded.email !== email) {
                res.send({ admin: false })
            }
            const query = { email: email }
            const user = await userCollection.findOne(query)
            const result = { admin: user?.role === 'admin' }
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Restaurant ongoing!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})