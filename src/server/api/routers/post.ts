import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { writeFormSchema } from "../../../components/WriteFormModal"
import slugify from "slugify";
import { z } from 'zod'
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .input(writeFormSchema.and(z.object({
            tagsIds: z.array(z.object({
                id: z.string()
            })).optional()
        })))
        .mutation(
            async ({ ctx: { prisma, session }, input: { description, text, title, tagsIds } }) => {

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
                        },
                        tags: {
                            connect: tagsIds
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
                        image: true,
                        username: true
                    }
                },
                bookmarks: session?.user.id ? {
                    where: {
                        userId: session?.user.id
                    }
                } : false,
                tags: {
                    select: {
                        name: true,
                        id: true,
                        slug: true
                    }
                },
                featuredImage: true
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
                    } : false,
                    authorId: true,
                    slug: true,
                    featuredImage: true
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

    submitComment: protectedProcedure
        .input(z.object({
            text: z.string().min(3),
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { postId, text } }) => {
            await prisma.comment.create({
                data: {
                    text,
                    author: {
                        connect: {
                            id: session.user.id
                        }
                    },
                    post: {
                        connect: {
                            id: postId
                        }
                    }
                }
            })
        }),

    getComments: publicProcedure
        .input(z.object({
            postId: z.string()
        }))
        .query(async ({ ctx: { prisma }, input: { postId } }) => {
            const comments = await prisma.comment.findMany({
                where: {
                    postId
                },
                select: {
                    id: true,
                    text: true,
                    author: {
                        select: {
                            name: true,
                            image: true
                        }
                    },
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            return comments
        }),

    getReadingList: protectedProcedure
        .query(async ({ ctx: { prisma, session } }) => {
            const allBookmarks = await prisma.bookmark.findMany({
                where: {
                    userId: session.user.id,
                },
                take: 4,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    post: {
                        select: {
                            title: true,
                            description: true,
                            author: {
                                select: {
                                    name: true,
                                    image: true,
                                }
                            },
                            createdAt: true,
                            slug: true
                        }
                    }
                }
            })

            return allBookmarks;
        }),

    updatePostFeaturedImage: protectedProcedure
        .input(z.object({
            imageUrl: z.string().url(),
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { imageUrl, postId } }) => {
            const post = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            })

            if(post?.authorId !== session.user.id){
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You are not the owner of the post'
                })
            }

            await prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    featuredImage: imageUrl
                }
            })
        })
})