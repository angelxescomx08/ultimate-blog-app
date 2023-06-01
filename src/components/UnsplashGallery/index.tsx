import Modal from '~/components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useDebounce from '~/hooks/useDebounce'
import Image from 'next/image'
import { z } from 'zod'
import { api } from '~/utils/api'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { BiLoaderAlt } from 'react-icons/bi'
import { toast } from 'react-hot-toast'

export const unsplashSchema = z.object({
    searchQuery: z.string().min(3)
})

type Props = {
    isOpenUnsplashModal: boolean;
    setIsOpenUnsplashModal: Dispatch<SetStateAction<boolean>>;
    postId: string;
    slug: string;
}

const UnsplashGallery = ({ isOpenUnsplashModal, setIsOpenUnsplashModal, postId, slug }: Props) => {

    const { register, watch, reset } = useForm<{ searchQuery: string }>({
        resolver: zodResolver(unsplashSchema)
    })

    const watchSearchQuery = watch('searchQuery')
    const debouncedSearchQuery = useDebounce(watchSearchQuery, 500)

    const fetchUnsplashImages = api.unsplash.getImages.useQuery({
        searchQuery: debouncedSearchQuery
    }, {
        enabled: Boolean(debouncedSearchQuery),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,

        queryKey: ['unsplash.getImages', {
            searchQuery: debouncedSearchQuery
        }]
    })

    const [selectedImage, setSelectedImage] = useState('')

    const postRoute = api.useContext().post;

    const updateFeaturedImage = api.post.updatePostFeaturedImage.useMutation({
        onSuccess: async () => {
            await postRoute.getPost.invalidate({ slug })
            setIsOpenUnsplashModal(false)
            reset()
            toast.success('Featured image updated')
        }
    })

    return (
        <Modal isOpen={isOpenUnsplashModal} onClose={() => setIsOpenUnsplashModal(false)}>
            <div className='flex flex-col space-y-4 justify-center items-center'>
                <input type="text" {...register('searchQuery')} id="search" className='w-full h-full border border-gray-300 focus:border-gray-600 outline-none p-4 rounded-xl' />
                {debouncedSearchQuery && fetchUnsplashImages.isLoading &&
                    <div className='flex w-full h-96 items-center justify-center'>
                        <BiLoaderAlt className='animate-spin' />
                    </div>
                }
                <div className='relative grid grid-cols-3 place-items-center gap-1 w-full h-96 overflow-y-scroll'>

                    {
                        fetchUnsplashImages.isSuccess && fetchUnsplashImages.data?.results.map(imageData => (
                            <div
                                key={imageData.id}
                                className={`aspect-video group relative w-full h-full hover:bg-black/40 cursor-pointer`}
                                onClick={() => setSelectedImage(imageData.urls.full)}
                            >
                                <div className={`absolute group-hover:bg-black/40 inset-0 z-10 h-full w-full ${selectedImage === imageData.urls.full ? 'bg-black/40' : ''}`}>
                                    <Image
                                        src={imageData.urls.regular}
                                        alt={imageData.alt_description ?? ''}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            </div>
                        ))
                    }
                </div>
                {selectedImage && <div>
                    <button
                        type='submit'
                        className='flex transition hover:border-gray-900 hover:text-gray-900 rounded items-center space-x-2 px-4 py-2.5 border border-gray-200'
                        onClick={() => {
                            updateFeaturedImage.mutate({
                                imageUrl: selectedImage,
                                postId
                            })
                        }}
                        disabled={updateFeaturedImage.isLoading}
                    >
                        {updateFeaturedImage.isLoading ? 'Loading...' : 'Confirm'}
                    </button>
                </div>}
            </div>
        </Modal>
    )
}

export default UnsplashGallery