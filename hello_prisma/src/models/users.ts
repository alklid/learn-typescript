import { builder } from "../builder";
import { prismaClient } from "../db";

// User 타입 정의 - ref를 저장
const UserObject = builder.prismaObject("users", {
    fields: (t) => ({
        // BigInt를 String으로 변환하여 ID 타입으로 노출
        id: t.field({
            type: "ID",
            resolve: (user) => user.id.toString(),
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
        
        // 관계 필드: user의 모든 plan을 가져옴
        // DataLoader가 자동으로 N+1 문제를 해결
        // 여러 user를 조회할 때, 각 user의 plan들을 한 번의 쿼리로 배치 처리
        plan: t.relation("plan"),
    })
});

// Query 타입 정의 (한 번만 호출)
builder.queryType({
    fields: (t) => ({
        users: t.field({
            type: [UserObject],
            resolve: async (root, args, context) => {
                console.log("🔴 Fetching all users (not using DataLoader for list query)");
                // 전체 목록 조회는 DataLoader를 사용하지 않음
                return prismaClient.users.findMany();
            },
        }),
        user: t.field({
            type: UserObject,
            nullable: true,
            args: {
                id: t.arg.int({ required: true }),
            },
            resolve: async (root, args, context) => {
                console.log("🟢 Loading user via DataLoader:", args.id);
                // DataLoader를 통해 로드 (캐시 활용)
                return context.userLoader.load(BigInt(args.id));
            },
        }),
    }),
});