import Link from 'next/link'
import Image from 'next/image'
import dayjs from 'dayjs'
import { CiBookmarkCheck, CiBookmarkPlus } from 'react-icons/ci'
import { useState } from 'react'
import { api, type RouterOutputs } from '~/utils/api'

type PostProps = RouterOutputs['post']['getPosts']['posts'][number]

const Post = ({ ...post }: PostProps) => {

    const [isBookmarked, setIsBookmarked] = useState(Boolean(post.bookmarks?.length))

    const bookmarkPost = api.post.bookmarkPost.useMutation({
        onSuccess: () => {
            setIsBookmarked(prev => !prev)
        }
    })
    const removeBookmark = api.post.removeBookmark.useMutation({
        onSuccess: () => {
            setIsBookmarked(prev => !prev)
        }
    })

    return (
        <div key={post.id} className='flex flex-col space-y-4 pb-8 border-b border-gray-300 last:border-none'>
            <Link href={`/user/${post.author.username}`} className='group flex w-full items-center space-x-2 cursor-pointer'>
                <div className='w-10 h-10 bg-gray-400 rounded-full relative'>
                    {
                        post.author.image
                        && <Image
                            className='rounded-full'
                            src={post.author.image}
                            fill
                            sizes='100%'
                            alt={post.author.name ?? ''}
                        />
                    }
                </div>
                <div>
                    <p className='font-semibold'>
                        <span className='group-hover:underline decoration-indigo-600'>{post.author.name}</span> &#x2022; {dayjs(post.createdAt).format('DD/MM/YYYY')}
                    </p>
                    <p className='text-sm'>Founder, teacher & developer</p>
                </div>
            </Link>
            <Link href={`/${post.slug}`} className='group h-44 grid grid-cols-12 w-full gap-4'>
                <div className='col-span-8 flex-col space-y-4 h-full'>
                    <p className='text-2xl font-bold text-gray-800 group-hover:underline decoration-indigo-600'>
                        {post.title}
                    </p>
                    <p className='text-sm text-gray-500 break-words truncate'>
                        {post.description}
                    </p>
                </div>
                <div className='col-span-4'>
                    <div className='bg-gray-300 w-full h-full rounded-xl transition hover:scale-105 transform duration-300 hover:shadow-xl'>
                        {post.featuredImage && <Image src={post.featuredImage} alt={post.title} fill className='rounded-xl' />}
                    </div>

                </div>
            </Link>
            <div>
                <div className='flex items-center w-full space-x-4 justify-between py-4'>
                    <div>
                        My topics:
                    </div>
                    <div className='flex space-x-2 items-center'>
                        {
                            post?.tags?.map((tag) => (
                                <div key={tag.id} className='rounded-3xl bg-gray-200/50 px-5 py-2' onClick={() => {
                                    //redirect
                                }}>
                                    {tag.name}
                                </div>
                            ))
                        }
                    </div>

                    <div>
                        {
                            isBookmarked
                                ? <CiBookmarkCheck className='text-3xl text-indigo-600 cursor-pointer' onClick={() => removeBookmark.mutate({
                                    postId: post.id
                                })} />
                                : <CiBookmarkPlus className='text-3xl cursor-pointer' onClick={() => bookmarkPost.mutate({
                                    postId: post.id
                                })} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post