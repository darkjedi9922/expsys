import { remote } from 'electron';
import { Db } from 'mongodb';

const connectDb = remote.require('./dist/js/electron/main/db').connectDb as () => Promise<Db>;

export { connectDb }