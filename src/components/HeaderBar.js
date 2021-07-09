import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { RiUser5Fill } from 'react-icons/ri'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { RiUser5Line } from 'react-icons/ri'

const HeaderBar = props => {
    const history = useHistory()
    const [activeTabs, setActiveTabs] = useState(props.name)
    useEffect(() => {
        switch (activeTabs) {
            case 'home':
                history.push('/')
                break;
            case 'favorites':
                history.push('/favorites')
                break;
            case 'settings':
                history.push('/settings')
                break;
            default:
                history.push('/')
                break;
        }
    }, [activeTabs, history])

    return (
        <div className='header-nav'>
            <div className='active-title'>
                <p className='title-text' onClick={() => setActiveTabs('home')}>XKCD: Alt</p>
            </div>
            <div className='bn-tab'>
                {activeTabs === 'favorites' ?
                    <AiFillHeart
                        size='26'
                        color='#000'
                        onClick={() => setActiveTabs('favorites')}
                    /> :
                    <AiOutlineHeart
                        size='26'
                        color='#000'
                        onClick={() => setActiveTabs('favorites')}
                    />}
            </div>
            <div className='bn-tab'>
                {activeTabs === 'settings' ?
                    <RiUser5Fill
                        size='26'
                        color='#000'
                        onClick={() => setActiveTabs('settings')}
                    /> :
                    <RiUser5Line
                        size='26'
                        color='#000'
                        onClick={() => setActiveTabs('settings')}
                    />}
            </div>
        </div>
    )
}

export default HeaderBar