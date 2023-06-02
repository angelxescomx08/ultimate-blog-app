import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { decode } from 'base64-arraybuffer'
//import isDataURI from 'is-data-uri'

import { createClient } from '@supabase/supabase-js'
import { env } from '~/env.mjs'
import { TRPCError } from "@trpc/server";

// Create a single supabase client for interacting with your database
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY)

export const authRouter = createTRPCRouter({
    getUserProfile: publicProcedure
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ ctx: { prisma, session }, input: { username } }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: session?.user.email as string
                }
            })
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
                            posts: true,
                            followedBy: true,
                            following: true,
                        }
                    },
                    followedBy: user && user.id ? {
                        where: {
                            id: user.id
                        }
                    } : false
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
                            } : false,
                            tags: {
                                select: {
                                    name: true,
                                    id: true,
                                    slug: true
                                }
                            },
                        }
                    }
                }
            })
        }),
    uploadAvatar: protectedProcedure
        .input(z.object({
            imageAsDataUrl: z.string(),//.refine(val => isDataURI(val)),
            username: z.string(),
        }))
        .mutation(async ({ ctx: { prisma }, input: { imageAsDataUrl, username } }) => {
            const imageBase64 = imageAsDataUrl.replace(/^.+,/, "")
            const { data, error } = await supabase
                .storage
                .from('public')
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
                .upload(`avatars/${username}.png`, decode(imageBase64), {
                    contentType: 'image/png',
                    upsert: true
                })

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'upload file fail to supabase'
                })
            }

            const {
                data: { publicUrl }
            } = supabase.storage.from('public').getPublicUrl(data.path);

            await prisma.user.update({
                where: {
                    username
                },
                data: {
                    image: publicUrl
                }
            })
        }),
    getSuggestions: protectedProcedure
        .query(async ({ ctx: { prisma, session } }) => {

            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })

            if (!user) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'No user with suggestions'
                });
            }
            const tagsQuery = {
                where: {
                    userId: user.id
                },
                select: {
                    post: {
                        select: {
                            tags: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                take: 10
            }

            const likesPostTags = await prisma.like.findMany(tagsQuery)
            const bookmarkedPostTags = await prisma.bookmark.findMany(tagsQuery)

            const interestedTags: string[] = []

            likesPostTags.forEach(like => {
                interestedTags.push(...like.post.tags.map(tag => tag.name))
            })

            bookmarkedPostTags.forEach(bookmark => {
                interestedTags.push(...bookmark.post.tags.map(tag => tag.name))
            })

            const queryObject = {
                some: {
                    post: {
                        tags: {
                            some: {
                                name: {
                                    in: interestedTags
                                }
                            }
                        }
                    }
                }
            }

            const suggestions = await prisma.user.findMany({
                where: {
                    OR: [
                        {
                            likes: {
                                ...queryObject
                            }
                        },
                        {
                            bookmarks: {
                                ...queryObject
                            }
                        }
                    ],
                    NOT: {
                        id: user.id
                    }
                },
                select: {
                    name: true,
                    image: true,
                    username: true,
                    id: true
                },
                take: 4
            })

            return suggestions
        }),
    followUser: protectedProcedure
        .input(z.object({
            followingUserId: z.string()
        }))
        .mutation(async ({ ctx: { session, prisma }, input: { followingUserId } }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if (!user) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'User not found'
                })
            }
            if (followingUserId === user.id) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: "You can't follow yourself"
                })
            }
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    following: {
                        connect: {
                            id: followingUserId
                        }
                    }
                }
            })
        }),
    unfollowUser: protectedProcedure
        .input(z.object({
            followingUserId: z.string()
        }))
        .mutation(async ({ ctx: { session, prisma }, input: { followingUserId } }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if (user) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        following: {
                            disconnect: {
                                id: followingUserId
                            }
                        }
                    }
                })
            }
        }),
    getAllFollowers: protectedProcedure
        .input(z.object({
            userId: z.string()
        }))
        .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if (!user) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Not user found'
                })
            }
            return await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    followedBy: {
                        select: {
                            name: true,
                            username: true,
                            id: true,
                            image: true,
                            followedBy: {
                                where: {
                                    id: user.id
                                }
                            }
                        }
                    }
                }
            })
        }),
    getAllFollowing: protectedProcedure
        .input(z.object({
            userId: z.string()
        }))
        .query(async ({ ctx: { prisma }, input: { userId } }) => {
            return await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    following: {
                        select: {
                            name: true,
                            username: true,
                            id: true,
                            image: true
                        }
                    }
                }
            })
        }),
})