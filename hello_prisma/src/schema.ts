import { builder } from "./builder";

// GraphQL 타입과 쿼리 정의를 포함한 모델 파일 import
import "./models/users";
import "./models/plan";

export const schema = builder.toSchema({});