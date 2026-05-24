'use client'
import ImageCard from '@/components/custom/ImageCard'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const page = () => {

    const { data , isLoading } = useQuery({
        queryKey: ['fetch'], queryFn: async () => {
            const res = await axios.get('/api/fetch-user')
            console.log("Fetched images from API:", res.data);
            return res.data
        }
    })

    if(isLoading){
        return <></>
    }


    return (
    <div>
        {data.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-screen'>
                <h2 className='text-2xl md:text-3xl font-semibold mb-4'>No Images Found</h2>
                <p className='text-gray-600'>You have not uploaded any images yet.</p>  
                </div>
                ) : (
                    <div className='p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {
                            data.map((item: any, index: number) => (
                                <ImageCard key={item.id} id={item.id} imageUrl={item.image} text={item.text} created_at={item.created_at} />
                            ))
                        }
                    </div>
                )}

    </div>

    )
}

export default page
