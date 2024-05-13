import Redis from "ioredis";
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

export const addPostToRedis = async (post) => {
  const postStr = JSON.stringify(post);
  const createAt = Number(post.createdAt);
  await redis.zadd("posts-sabry", -createAt, postStr);
};

export const getPostsFromRedis = async (offset, limit) => {
  const posts = await redis.zrange("posts-sabry", offset, offset + limit - 1);

  return posts.map((str) => {
    return JSON.parse(str);
  });
};

export default redis;
