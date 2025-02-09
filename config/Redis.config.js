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


//using ioredis and Upstash Redis for affordability and deployment 

import Redis from "ioredis";
const redisclient = new Redis(process.env.REDIS_STRING);

redisclient.on("connect", () => {
  console.log("Connected to Redis");
});
redisclient.on("error", (error) => {
  console.error("Redis error:", error.message);
});

export default redisclient;
