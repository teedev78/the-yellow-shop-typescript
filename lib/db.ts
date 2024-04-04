import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI ?? "";

export async function connectToDatabase() {
  const client = await MongoClient.connect(uri);
  return client;
}
