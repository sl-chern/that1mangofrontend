import React, {useRef, useState, useEffect} from 'react'
import './style.css'
import rickroll from './Assets/asset.dat'

export default function RickRoll(props) {

    let pressedKeys = []

    const [style, setStyle] = useState({
        display: "none"
    })

    let videoRef = useRef()

    const eventFunction = (event) => {
        if(event.key === props.keys[pressedKeys.length])
            pressedKeys.push(props.keys[pressedKeys.length])
        else 
            pressedKeys = []
        if(JSON.stringify(props.keys) === JSON.stringify(pressedKeys))
        {
            setStyle({
                display: "block"
            })
            if(videoRef.current) {
                videoRef.current.play()
                videoRef.current.addEventListener("ended", () => {
                    setStyle({
                        display: "none"
                    })
                })
            }
            pressedKeys = []
        }
            
    }

    useEffect(() => {
        window.addEventListener("keypress", eventFunction)
        return () => window.removeEventListener("keypress", eventFunction)
    }, [])

    return (
        <video ref={videoRef} style={style} id="assetVideo" onClick={() => {
            setStyle({
                display: "none"
            })
            videoRef.current.pause()
            videoRef.current.currentTime = 0
            pressedKeys = []
        } }>
            <source src={rickroll}/>
        </video>
    )
}
