import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { writeFormSchema } from "../../../components/WriteFormModal"
import slugify from "slugify";
import { z } from 'zod'
import { TRPCError } from "@trpc/server";

const LIMIT = 5

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .input(writeFormSchema.and(z.object({
            tagsIds: z.array(z.object({
                id: z.string()
            })).optional(),
        })))
        .mutation(
            async ({ ctx: { prisma, session }, input: { description, text, title, tagsIds, html } }) => {
                const user = await prisma.user.findUnique({
                    where: {
                        email: session.user.email as string
                    }
                })
                if(user){
                    await prisma.post.create({
                        data: {
                            title,
                            description,
                            text,
                            slug: slugify(title),
                            html,
                            author: {
                                connect: {
                                    id: user.id
                                },
                            },
                            tags: {
                                connect: tagsIds
                            }
                        }
                    })
                }
            }
        ),
    getPosts: publicProcedure
        .input(z.object({
            cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
        }))
        .query(async ({ ctx: { prisma, session }, input: { cursor } }) => {
            const posts = await prisma.post.findMany({
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
                },
                cursor: cursor ? { id: cursor } : undefined,
                take: LIMIT + 1,
            })

            let nextCursor: typeof cursor | undefined = undefined;
            if (posts.length > LIMIT) {
                const nextItem = posts.pop()
                if (nextItem) {
                    nextCursor = nextItem.id;
                }
            }

            return { posts, nextCursor }
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
                    html: true,
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
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if(user){
                await prisma.like.create({
                    data: {
                        postId,
                        userId: user.id
                    }
                })
            }
        }),

    dislikePost: protectedProcedure
        .input(z.object({
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if(user){
                await prisma.like.delete({
                    where: {
                        userId_postId: {
                            userId: user.id,
                            postId
                        }
                    }
                })
            }
        }),


    bookmarkPost: protectedProcedure
        .input(z.object({
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if(user){
                await prisma.bookmark.create({
                    data: {
                        postId,
                        userId: user.id
                    }
                })
            }
        }),

    removeBookmark: protectedProcedure
        .input(z.object({
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if(user){
                await prisma.bookmark.delete({
                    where: {
                        userId_postId: {
                            userId: user.id,
                            postId
                        }
                    }
                })
            }
        }),

    submitComment: protectedProcedure
        .input(z.object({
            text: z.string().min(3),
            postId: z.string()
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { postId, text } }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if(user){
                await prisma.comment.create({
                    data: {
                        text,
                        author: {
                            connect: {
                                id: user.id
                            }
                        },
                        post: {
                            connect: {
                                id: postId
                            }
                        }
                    }
                })
            }
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
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if(!user){
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'User not found'
                })
            }
            const allBookmarks = await prisma.bookmark.findMany({
                where: {
                    userId: user.id,
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
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            const post = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            })

            if(!user){
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'User not found'
                })
            }

            if (post?.authorId !== user.id) {
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