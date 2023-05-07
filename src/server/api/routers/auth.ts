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
        }),
    uploadAvatar: protectedProcedure
        .input(z.object({
            imageAsDataUrl: z.string(),//.refine(val => isDataURI(val)),
            username: z.string(),
        }))
        .mutation(async ({ ctx: { prisma, session }, input: { imageAsDataUrl, username } }) => {
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
        })
})