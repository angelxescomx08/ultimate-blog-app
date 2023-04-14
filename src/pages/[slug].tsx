import { useRouter } from 'next/router'
import { MainLayout } from '~/layouts'

const PostPage = () => {
    const router = useRouter()
    return (
        <MainLayout>
            <div className='flex flex-col h-full w-full justify-center items-center p-10'>
                <div className='max-w-screen-lg w-full flex flex-col space-y-6'>
                    <div className='h-[60vh] w-full rounded-xl bg-gray-300 shadow-lg'>

                    </div>
                    <div className='border-l-4 border-gray-800 pl-6 '>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium quibusdam molestiae fuga incidunt eius eligendi, sint aliquid amet numquam ducimus? Ex officia aperiam voluptatibus, natus magni aspernatur necessitatibus blanditiis ab.
                    </div>
                    <div>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima sint ut, non expedita dolor quia ullam nostrum blanditiis modi, quaerat temporibus reiciendis labore odio vitae doloremque nihil. Doloremque quibusdam ad molestiae tenetur sequi. Corrupti excepturi voluptatum eveniet saepe facere quos ipsam voluptates. Similique odit necessitatibus rerum consectetur nostrum? Accusamus amet eos architecto voluptatum. Iusto animi laborum quis possimus dignissimos tenetur ad libero. Sequi suscipit nemo modi dicta, aut non quia officiis sit. Molestias, voluptas? Dolorum veniam assumenda quo aperiam at autem dolore amet consequatur perferendis doloremque nesciunt est maiores labore, ex illo itaque atque quibusdam, repellendus optio nobis reiciendis quos!
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default PostPage