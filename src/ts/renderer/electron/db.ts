const { remote } = window.require('electron');
import { Db } from 'mongodb';

const connectDb = remote.require('./dist/js/desktop/db').connectDb as () => Promise<Db>;

export { connectDb }