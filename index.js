import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const ConnectedClient = await connectToMongoDB();
const db = ConnectedClient.db('hireloop-db');
const users = db.collection('user');
const jobs = db.collection('jobs');



app.get('/', (req, res) => {
  res.send('HireLoop Backend Server is running');
});


app.get('/users', async (req, res) => {
    const cursor = users.find({});
    const result = await cursor.toArray();
    res.send(result);
});

//  job releted api
app.post('/jobs', async (req, res) => {
  const job = req.body;
  const result = await jobs.insertOne(job);
  res.send(result);
}); 

app.get('/jobs', async (req, res) => {
    const cursor = jobs.find({});
    const result = await cursor.toArray();
    res.send(result);
})

app.delete('/jobs/:id', async (req,res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await jobs.deleteOne(query);
    res.send(result);
})



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});