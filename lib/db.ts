import { MongoClient } from "mongodb";

const uri: string = process.env.DATABASE_URL ?? "";

export async function connectToDatabase() {
  const client = await MongoClient.connect(uri);
  return client;
}
