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
                    username: true,
                    _count: {
                        select: {
                            posts: true
                        }
                    }
                }
            })
        }),
    getUserPost: publicProcedure
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ ctx: { prisma, session }, input: { username } }) => {
            return await prisma.user.findUnique({
                where: {
                    username
                },
                select: {
                    posts: {
                        select: {
                            id: true,
                            slug: true,
                            title: true,
                            description: true,
                            createdAt: true,
                            author: {
                                select: {
                                    name: true,
                                    image: true,
                                    username: true
                                }
                            },
                            bookmarks: session?.user.id ? {
                                where: {
                                    userId: session?.user.id
                                }
                            } : false
                        }
                    }
                }
            })
        })
})