import mongoose from 'mongoose';
import { env } from './env.js';

let connection;

export function connectDatabase() {
  if (!connection) connection = mongoose.connect(env.mongoUri);
  return connection;
}
