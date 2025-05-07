import redis from "redis";

const client = redis.createClient({
  host: '127.0.0.1', 
  port: 6379,        
});

await client.connect();

client.on("error", (err) => {
  console.log("Redis error:", err);
});

export default client;