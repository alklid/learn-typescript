import DataLoader from "dataloader";
import type { Context } from "./builder";
import { prismaClient } from "./db";

// DataLoader 배치 함수: 여러 ID를 한 번에 로드
async function batchUsers(ids: readonly bigint[]) {
  console.log("🔵 DataLoader batch loading users:", ids.map(id => id.toString()));
  
  const users = await prismaClient.users.findMany({
    where: {
      id: { in: [...ids] },
    },
  });

  // ID 순서대로 정렬하여 반환 (DataLoader는 순서가 중요함)
  const userMap = new Map(users.map((user) => [user.id.toString(), user]));
  return ids.map((id) => userMap.get(id.toString()) || new Error(`User not found: ${id}`));
}

// Context 생성 함수
export function createContext(): Context {
  return {
    // 각 요청마다 새로운 DataLoader 인스턴스 생성
    userLoader: new DataLoader(batchUsers, {
      // 캐싱 활성화 (기본값: true)
      cache: true,
      // 배치 크기 제한 없음
      maxBatchSize: 1000,
      // 배치 스케줄링: 다음 틱까지 대기하여 더 많은 로드를 모음
      // 기본값은 process.nextTick을 사용하여 즉시 배치 실행
      batchScheduleFn: (callback) => setTimeout(callback, 100), // 10ms 지연
    }),
  };
}
