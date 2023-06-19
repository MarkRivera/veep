import { createClient } from 'redis';
import { RedisTask } from '../types';

export const client = createClient();
const channel = 'video_queue';

client.on("connect", (err) => {
  if (err) {
    console.error("Error connecting to Redis");
    console.error(err);
  }

  console.log("Connected to Redis");
})


export async function push_task(value: RedisTask) {
  try {
    await client.rPush(channel, JSON.stringify(value));
    console.log('Value set successfully.');
  } catch (error) {
    console.error('Error setting value:', error);
  }
}

export async function get_hash_value(key: string) {
  try {
    const value = await client.hGetAll(key);
    console.log('Value:', value);
    return value;
  } catch (error) {
    console.error('Error getting value:', error);
  }
}