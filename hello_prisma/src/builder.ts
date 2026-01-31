import SchemaBuilder from "@pothos/core";
import DataLoaderPlugin from "@pothos/plugin-dataloader";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { DateResolver } from "graphql-scalars";
import { getDatamodel } from "../lib/pothos-prisma-types";
import { prismaClient } from "./db";
import DataLoader from "dataloader";

// Context 타입 정의 - DataLoader를 포함
export interface Context {
  // User를 ID로 로드하는 DataLoader
  userLoader: DataLoader<bigint, any>;
}

export const builder = new SchemaBuilder<{
  Context: Context;
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
  PrismaTypes: PrismaTypes;
}>({
    plugins: [DataLoaderPlugin, PrismaPlugin],
    prisma: {
        client: prismaClient,
        dmmf: getDatamodel(),
        // DataLoader를 사용하여 N+1 문제 해결
        // onUnusedQuery를 설정하여 사용되지 않은 쿼리를 경고
        onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
    },
});

builder.addScalarType("Date", DateResolver, {});
