import { api } from '~/utils/api'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { HiChevronDown } from 'react-icons/hi'
import { CiSearch } from 'react-icons/ci'
import Post from '../Post'


const MainSection = () => {
    const posts = api.post.getPosts.useQuery()

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
                        <Post {...post} key={post.id} />
                    ))
                }
            </div>
        </main>
    )
}

export default MainSection