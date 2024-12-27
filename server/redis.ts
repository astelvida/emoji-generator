"use server";

import redisClient from "@/lib/redis-client";

export async function storeEmoji(id: string, data: Record<string, string>) {
  await redisClient.hset(id, data);
}

export async function getStoredEmoji(id: string) {
  return redisClient.hgetall(id);
}

export async function updateStoredEmoji(id: string, data: Record<string, unknown>) {
  await redisClient.hmset(id, data);
}
