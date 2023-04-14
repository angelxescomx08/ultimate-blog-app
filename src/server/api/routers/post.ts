import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { writeFormSchema } from "../../../components/WriteFormModal"
import slugify from "slugify";

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
    getPost: publicProcedure.query(async ({ ctx: { prisma } }) => {
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
    })
})