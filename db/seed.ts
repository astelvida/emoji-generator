import { db } from "./index";
import { users } from "./schema";
import usersData from "./users.json";

export const seed = async () => {
  await db.insert(users).values(usersData);
};



seed();