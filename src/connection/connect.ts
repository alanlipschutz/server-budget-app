import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();
const MONGO_URI: string = process.env.MONGO_URI;

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectToDB(): Promise<MongoClient> {
  await client.connect();
  return client;
}

export async function getDb(): Promise<Db> {
  const client = await connectToDB();
  return client.db();
}

export async function run() {
  try {
    await connectToDB();
    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection
    await client.db().command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
