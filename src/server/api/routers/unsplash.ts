import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createApi } from 'unsplash-js';
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { unsplashSchema } from "~/components/UnsplashGallery";

const unsplash = createApi({
    accessKey: env.UNSPLASH_API_ACCESS_KEY,
});

export const unsplashRouter = createTRPCRouter({
    getImages: protectedProcedure
        .input(
            unsplashSchema
        )
        .query(async ({ input: { searchQuery } }) => {
            try {
                const imagesData = await unsplash.search.getPhotos({
                    query: searchQuery,
                    orientation: 'landscape',
                    orderBy: 'relevant',
                })
                return imagesData.response
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'unsplash api not working'
                })
            }
        })
})