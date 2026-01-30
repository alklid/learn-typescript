import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { DateResolver } from "graphql-scalars";
import { getDatamodel } from "../lib/pothos-prisma-types";
import { prismaClient } from "./db";

// Context 타입 정의
export interface Context {}

export const builder = new SchemaBuilder<{
  Context: Context;
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
  PrismaTypes: PrismaTypes;
}>({
    plugins: [PrismaPlugin],
    prisma: {
        client: prismaClient,
        dmmf: getDatamodel(),
    },
});

builder.addScalarType("Date", DateResolver, {});
