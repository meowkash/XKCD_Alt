import { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { sendGetRequest } from '../services/loadComic'
import './ComicBox'

const month_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const ComicBox = props => {
    var title = ''
    var alt = ''
    var date = ''
    var img_src = ''

    sendGetRequest(props.url, function (response) {
        title = response.safe_title;
        alt = response.alt;
        date = response.day + " " + month_array[response.month - 1] + ", " + response.year;
        img_src = response.img
    }, true)
    
    return (
        <div className='comic-outline'>
            <div className='comic-header'>
                <p>{props.number}</p>
                <p>{title}</p>
            </div>
            <div className='comic-image'>
                <div>
                    <LazyLoadImage
                        alt={'XKCD ' + props.number}
                        src={img_src} // use normal <img> attributes as props
                        effect="blur"
                    />
                </div>
            </div>
            <div className='action-strip'>
                <ul className='horizontal-list'>
                    <li>
                        <p>{date}</p>
                    </li>
                    <li className='comic-action'>
                        <button type="button" className="likeBtn" aria-label="like"></button>
                    </li>
                    <li className='comic-action'>
                        <button type="button" className="shareBtn" aria-label="share"></button>
                    </li>
                    <li className='comic-action'>
                        <button type="button" className="saveBtn" aria-label="save"></button>
                    </li>
                </ul>
            </div>
            <div className='comic-text'>
                <p>Alt: {alt}</p>
            </div>
        </div>
    )
}

export default ComicBox