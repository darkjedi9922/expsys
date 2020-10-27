import { MongoClient, Db } from 'mongodb';
import { app } from 'electron';

const uri = 'mongodb://localhost:27017/?poolSize=20&w=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });

let connection: Db = null

const connect = async (): Promise<Db> => {
    if (connection === null) {
        try {
            await client.connect();
            let db = client.db('expsys');
            await db.command({ ping: 1 });
            console.log('Connected successfuly to server');
            connection = db;
        } catch (err) {
            await client.close();
            throw err;
        }
    }
    return connection;
}

app.on('quit', () => client.close());

export { connect as connectDb };