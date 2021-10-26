import React, { useState, useEffect } from 'react';
import socket from '../libs/socket'
import Cards from '../components/Cards'

export default function Tweets() {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {

        socket.on('datamysql', (data) => {

            //console.log(data.alltweets)
            setTweets(data.alltweets)
        })

        /*

        if (tweets.length === 0) {
            //socket.emit('conectado', "hola desde react")
            socket.on('insercion', (data) => {
                setTweets(data)
            })
        }

        */

    }, [tweets]);

    useEffect(() => {
        socket.on('datamongo', (data) => {
            //console.log(data.alltweets)
            setTweets(data.alltweets)
        })
    });

    //socket.emit('conectado', "hola desde react")

    return (
        <div>
            <Cards tweets={tweets} />
        </div>
    )
}
