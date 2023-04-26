import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { writeFormSchema } from "../../../components/WriteFormModal"
import slugify from "slugify";
import { z } from 'zod'

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .input(writeFormSchema)
        .mutation(
            async ({ ctx: { prisma, session }, input: { description, text, title } }) => {

                //validar que el titulo sea único

                await prisma.post.create({
                    data: {
                        title,
                        description,
                        text,
                        slug: slugify(title),
                        author: {
                            connect: {
                                id: session.user.id
                            }
                        }
                    }
                })
            }
        ),
    getPosts: publicProcedure.query(async ({ ctx: { prisma, session } }) => {
        const post = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            /* include: {
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            } */
            select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                createdAt: true,
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                bookmarks: session?.user.id ? {
                    where: {
                        userId: session?.user.id
                    }
                } : false
            }
        })
        return post
    }),

    getPost: publicProcedure
        .input(z.object({
            slug: z.string()
        }))
        .query(async ({ ctx: { prisma, session }, input: { slug } }) => {
            const post = await prisma.post.findUnique({
                where: {
                    slug
                },
                select: {
                    id: true,
                    description: true,
                    title: true,
                    text: true,
                    likes: session?.user?.id ? {
                        where: {
                            userId: session?.user.id
                        }
                    } : false
                }
            })
            return post
        }),

    likePost: protectedProcedure
        .input(z.object({
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
            await prisma.like.create({
                data: {
                    postId,
                    userId: session.user.id
                }
            })
        }),

    dislikePost: protectedProcedure
        .input(z.object({
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
            await prisma.like.delete({
                where: {
                    userId_postId: {
                        userId: session.user.id,
                        postId
                    }
                }
            })
        }),


    bookmarkPost: protectedProcedure
        .input(z.object({
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
            await prisma.bookmark.create({
                data: {
                    postId,
                    userId: session.user.id
                }
            })
        }),

    removeBookmark: protectedProcedure
        .input(z.object({
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
            await prisma.bookmark.delete({
                where: {
                    userId_postId: {
                        userId: session.user.id,
                        postId
                    }
                }
            })
        }),
})