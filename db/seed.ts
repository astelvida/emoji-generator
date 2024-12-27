// import emojis_users from "./emojis_users.json";
// import emojis_emojis from "./emojis_emojis (4).json";
import { db } from ".";
import { emojis } from "./schema";
// import { users } from "./schema";

// console.log(emojis_users);
// console.log(emoji.s_emojis);

// Function to convert a string from snake_case to camelCase
function snakeToCamel(snakeString) {
  return snakeString.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Function to map object keys from snake_case to camelCase
function mapKeysToCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(mapKeysToCamelCase); // Recursively handle arrays
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        snakeToCamel(key),
        mapKeysToCamelCase(value), // Recursively handle nested objects
      ])
    );
  }
  return obj; // Return the value directly if it's not an object or array
}

// async function seed() {
//   await db.insert(emojis).values(
//     emojis_emojis.map((emoji) => ({
//       ...mapKeysToCamelCase(emoji),
//       createdAt: new Date(emoji.created_at),
//       updatedAt: new Date(emoji.updated_at),
//     }))
//   );

//   console.log("seeded EMOJIS");
//   // await db.insert(emojis).values(emojis_emojis);
// }

// seed();

// console.log(emojis_emojis.slice(0, 3).map(mapKeysToCamelCase));
