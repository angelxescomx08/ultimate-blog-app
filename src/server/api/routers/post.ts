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
    getPosts: publicProcedure.query(async ({ ctx: { prisma } }) => {
        const post = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        })
        return post
    }),

    getPost: publicProcedure
        .input(z.object({
            slug: z.string()
        }))
        .query(async ({ ctx: { prisma }, input: { slug } }) => {
            const post = await prisma.post.findUnique({
                where: {
                    slug
                }
            })
            return post
        })
})