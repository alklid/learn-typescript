import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { schema } from "./schema";
import { createContext } from "./context";

const yoga = createYoga({
  schema,
  // 각 요청마다 새로운 context 생성 (DataLoader가 요청별로 캐싱하도록)
  context: createContext,
});

const server = createServer(yoga.requestListener);
server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
