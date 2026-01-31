import { builder } from "../builder";
import { prismaClient } from "../db";

// Plan 타입 정의
builder.prismaObject("plan", {
    fields: (t) => ({
        id: t.field({
            type: "ID",
            resolve: (plan) => plan.id.toString(),
        }),
        userId: t.field({
            type: "ID",
            resolve: (plan) => plan.user_id.toString(),
        }),
        round: t.exposeInt("round"),
        planDay: t.exposeInt("plan_day"),
        bible: t.exposeInt("bible"),
        isCompleted: t.exposeInt("is_completed"),
        dateStarted: t.expose("date_started", { type: "Date", nullable: true }),
        dateCompleted: t.expose("date_completed", { type: "Date", nullable: true }),
        dateUpdated: t.expose("date_updated", { type: "Date", nullable: true }),
        dateCreated: t.expose("date_created", { type: "Date" }),
        
        // 관계 필드: DataLoader를 명시적으로 사용
        // Context의 userLoader를 사용하여 캐시 공유
        user: t.field({
            type: "users",
            resolve: (plan, args, context) => {
                console.log("🟡 Loading user for plan via DataLoader:", plan.user_id.toString());
                // Context의 userLoader를 사용하여 캐싱 활용
                return context.userLoader.load(plan.user_id);
            },
        }),
    })
});

// Query에 plan 추가
builder.queryFields((t) => ({
    plans: t.prismaField({
        type: ["plan"],
        args: {
            userId: t.arg.int({ required: false }),
        },
        resolve: async (query, root, args) => {
            const whereClause = args.userId ? { user_id: BigInt(args.userId) } : {};
            return prismaClient.plan.findMany({
                ...query,
                ...(Object.keys(whereClause).length > 0 && { where: whereClause }),
            });
        },
    }),
}));
