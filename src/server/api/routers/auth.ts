import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
    getUserProfile: publicProcedure
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ ctx: { prisma }, input: { username } }) => {
            return await prisma.user.findUnique({
                where: {
                    username
                },
                select: {
                    name: true,
                    image: true,
                    id: true,
                    username: true
                }
            })
        })
})