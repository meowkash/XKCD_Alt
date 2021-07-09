import React from 'react'
import HeaderBar from '../components/HeaderBar'
import ComicBox from '../components/ComicBox'

const Home = () => {
    return (
        <div className='screen'>
            <HeaderBar name='home' />
            <div className='homescreen'>
                <ComicBox url='https://xkcd.vercel.app/?comic=100' number='100'></ComicBox>
            </div>
        </div>
    )
}

export default Home