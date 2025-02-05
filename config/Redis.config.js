// import redis from "redis"
// const redisClient = redis.createClient({
//     socket:{
//         host:process.env.REDIS_HOST,
//         port:process.env.REDIS_PORT
//     }
// })
// redisClient.connect();
// redisClient.on("connect",()=>{console.log("Connected To redis")});
// redisClient.on("error",(error)=>{console.log("Internal server error",error.message)});
// export default redisClient;


// For deployment using Redis with Upstash (a free-tier Redis service),
// since Redis is a paid service on Render. Upstash offers a free Redis tier 
// suitable for development and small-scale applications. Ensure to configure 
// the Redis URI appropriately with your Upstash credentials for smooth 
// integration and functionality.

import Redis from "ioredis"
import { config } from "dotenv";
config()
const redisClient = new Redis(process.env.REDIS_STRING);
export default redisClient;
