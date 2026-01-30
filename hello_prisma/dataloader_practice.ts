import DataLoader from "dataloader";
import { prismaClient } from "./lib/prisma";

// Define the replacer function
function bigIntReplacer(key: string, value: any) {
  if (typeof value === "bigint") {
    return value.toString(); // Convert BigInt to string
  }
  return value; // Return all other values unchanged
}

async function main() {
  // not use dataloader
  const userA = await prismaClient.users.findUnique({
    where: {
      id: 23,
    },
  });
  console.log("UserA:", JSON.stringify(userA, bigIntReplacer, 2));

  const userB = await prismaClient.users.findUnique({
    where: {
      id: 23,
    },
  });
  console.log("UserB:", JSON.stringify(userB, bigIntReplacer, 2));

  console.log(userA === userB); // false
  console.log("--------------------------------");

  // use dataloader
  const userLoader = new DataLoader(async (ids: readonly number[]) => {
    const users = await prismaClient.users.findMany({
      where: {
        id: { in: [...ids] },
      },
    });
    return users.map((user) => user.id);
  });
  const userPromiseX = userLoader.load(23);
  const userPromiseY = userLoader.load(23);
  const [userX, userY] = await Promise.all([userPromiseX, userPromiseY]);
  console.log("UserX:", JSON.stringify(userX, bigIntReplacer, 2));
  console.log("UserY:", JSON.stringify(userY, bigIntReplacer, 2));
  console.log(userX === userY); // true
  console.log("--------------------------------");
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
