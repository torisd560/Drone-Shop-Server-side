const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const port = process.env.PORT || 5000

//========================= middleWare =========================
app.use(cors())
app.use(express.json())

//========================== connect mongoDb=====================
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ruilc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//=================== function for all api method===============

async function run() {
    try {
        await client.connect()

        const database = client.db('Drone-Store')
        const productCollection = database.collection('products')
        const userCollection = database.collection('users')
        const ordersCollection = database.collection('orders')


        // ================GET method for getting 6 products===============
        app.get('/products', async (req, res) => {
            const products = await productCollection.find({}).limit(6).toArray()
            res.send(products)
        })

        // ============== GET method for all products =====================
        app.get('/moreProducts', async (req, res) => {
            const allProducts = await productCollection.find({}).toArray()
            res.send(allProducts)
        })

        //============ POST method for add product===================

        app.post('/moreProducts', async (req, res) => {
            const product = await productCollection.insertOne(req.body)
            res.send(product)
        })


        //============== DELETE method for delete product =================

        app.delete('/moreProducts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

        //=================== GET method for one product ==================
        app.get('/moreProducts/placeOrder/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query)
            res.send(product)
        })

        // =================POST method for order data=================
        app.post('/orders', async (req, res) => {
            const orders = await ordersCollection.insertOne(req.body)
            res.send(orders)
        })

        // ===================GET method for all order==========
        app.get('/orders', async (req, res) => {
            const allOrders = await ordersCollection.find({}).toArray()
            res.send(allOrders)
        })

        //==================GET method for single orders =================
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            console.log(query)
            const result = await ordersCollection.find(query).toArray()
            res.send(result)

        })

        // ===========PUT method for update order status=====================
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id
            const updateStatus = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    status: updateStatus.status
                }
            }
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            res.send(result)

        })


        //==================== DELETE method for delete orders==============
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const deleteOrder = await ordersCollection.deleteOne(query)
            res.send(deleteOrder)

        })


        // ==================== POST method for register data =================
        app.post('/users', async (req, res) => {
            const user = await userCollection.insertOne(req.body)
            res.send(user)
        })

        // =======================PUT method for upsert user=====================
        app.put('/users', async(req,  res) =>{
            const user = req.body
            const filter = {user : user.email}
            const options = {upsert : true}
            const updateDoc = { $set : user}
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
    }

    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running server successfully')
})

app.listen(port, () => {
    console.log('Running server on port ', port)
})