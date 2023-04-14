import { api } from '~/utils/api'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import dayjs from 'dayjs'
import Image from 'next/image'
import { CiSearch } from 'react-icons/ci'
import { HiChevronDown } from 'react-icons/hi'
import Link from 'next/link'

const MainSection = () => {
    const posts = api.post.getPost.useQuery()
    return (
        <main className='col-span-8 border-r border-gray-300 w-full h-full px-24'>
            <div className='flex flex-col space-y-4 w-full py-10'>
                <div className='flex space-x-4 items-center w-full'>
                    <label htmlFor='search' className='relative w-full border-gray-800 border rounded-3xl'>
                        <div className='absolute left-2 h-full flex items-center'>
                            <CiSearch />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className='w-full rounded-3xl outline-none placeholder:text-gray-300 placeholder:text-xs text-sm py-1 px-4 pl-7'
                            placeholder='Search...'
                        />
                    </label>
                    <div className='flex items-center w-full space-x-4 justify-end'>
                        <div>
                            My topics:
                        </div>
                        <div className='flex space-x-2 items-center'>
                            {
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className='rounded-3xl bg-gray-200/50 px-4 py-3'>tag {i}</div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='pb-8 w-full justify-between flex items-center border-b border-gray-300'>
                    <div>Articles</div>
                    <div>
                        <button className='flex items-center font-semibold space-x-2 rounded-3xl px-4 py-1.5 border-gray-800 border'>
                            <div>Following</div>
                            <div>
                                <HiChevronDown className='text-xl' />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-col justify-center space-y-8'>

                {
                    posts.isLoading && <div className='w-full h-full flex justify-center items-center space-x-4'>
                        <div>
                            <AiOutlineLoading3Quarters className='animate-spin' />
                        </div>
                        <div>
                            Loading...
                        </div>
                    </div>
                }

                {
                    posts.isSuccess && posts.data.map((post) => (
                        <Link href={`/${post.slug}`} key={post.id} className='flex group flex-col space-y-4 pb-8 border-b border-gray-300 last:border-none'>
                            <div>
                                <div className='flex w-full items-center space-x-2'>
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
                                        <p className='font-semibold'>{post.author.name} &#x2022; {dayjs(post.createdAt).format('DD/MM/YYYY')} </p>
                                        <p className='text-sm'>Founder, teacher & developer</p>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-12 w-full gap-4'>
                                <div className='col-span-8 flex-col space-y-4'>
                                    <p className='text-2xl font-bold text-gray-800 group-hover:underline decoration-indigo-600'>
                                        {post.title}
                                    </p>
                                    <p className='text-sm text-gray-500 break-words'>
                                        {post.description}
                                    </p>
                                </div>
                                <div className='col-span-4'>
                                    <div className='bg-gray-300 w-full h-full rounded-xl transition hover:scale-105 transform duration-300 hover:shadow-xl'></div>
                                </div>
                            </div>
                            <div>
                                <div className='flex items-center w-full space-x-4 justify-start py-4'>
                                    <div>
                                        My topics:
                                    </div>
                                    <div className='flex space-x-2 items-center'>
                                        {
                                            Array.from({ length: 4 }).map((post, i) => (
                                                <div key={i} className='rounded-3xl bg-gray-200/50 px-5 py-2'>
                                                    tag {i}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </main>
    )
}

export default MainSection