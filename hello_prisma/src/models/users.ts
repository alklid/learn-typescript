import { builder } from "../builder";
import { prismaClient } from "../db";

// User 타입 정의
builder.prismaObject("users", {
    fields: (t: any) => ({
        // BigInt를 String으로 변환하여 ID 타입으로 노출
        id: t.field({
            type: "ID",
            resolve: (user: any) => user.id.toString(),
        }),
        email: t.exposeString("email"),
        profileThumbUrl: t.exposeString("profile_thumb_url", { nullable: true }),
        profileVerse: t.exposeString("profile_verse"),
        profileLink: t.exposeString("profile_link"),
        nickName: t.exposeString("nick_name"),
        privileges: t.exposeString("privileges"),
        isFirstPlanInitialize: t.exposeInt("is_first_plan_initialize"),
        isSponsored: t.exposeInt("is_sponsored"),
        isSignOut: t.exposeInt("is_sign_out"),
        dateSignOut: t.expose("date_sign_out", { type: "Date", nullable: true }),
        dateUpdated: t.expose("date_updated", { type: "Date", nullable: true }),
        dateCreated: t.expose("date_created", { type: "Date" }),
    })
});

// Query 타입 정의 (한 번만 호출)
builder.queryType({
    fields: (t: any) => ({
        users: t.prismaField(
            {
                type: ["users"],
                args: {
                    id: t.arg.int({ required: false }),
                },
                resolve: async (query: any, root: any, args: any) => {
                    // args.id가 있으면 해당 id로 필터링
                    return prismaClient.users.findMany({
                        ...query
                    });
                },
            }
        ),
        user: t.prismaField(
            {
                type: "users",
                args: {
                    id: t.arg.int({ required: true }),
                },
                resolve: async (query: any, root: any, args: any) => {
                    // args.id가 있으면 해당 id로 필터링
                    return prismaClient.users.findUnique({
                        where: { id: BigInt(args.id) }
                    });
                },
            }
        ),
    }),
});