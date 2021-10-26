import React, { useState, useEffect } from 'react'
import socket from '../libs/socket'
import CanvasJSReact from '../assets/canvasjs.react';
//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default function Tophashtags() {
    const [topHashtags, setTopHashtags] = useState([]);

    useEffect(() => {



        socket.on('datamysql', (data) => {
            let temp = []

            for (let index = 0; index < data.tophashtags.length; index++) {
                const element = data.tophashtags[index];
                if (index === 0) temp.push({ y: parseInt(element.TotalUpvotes), label: element.hashtag, color: '#1D9BF0' })
                else if (index === 1) temp.push({ y: parseInt(element.TotalUpvotes), label: element.hashtag, color: '#898383' })
                else if (index === 2) temp.push({ y: parseInt(element.TotalUpvotes), label: element.hashtag, color: '#0E3B59' })
                else if (index === 3) temp.push({ y: parseInt(element.TotalUpvotes), label: element.hashtag, color: '#C2C9CD' })
                else if (index === 4) temp.push({ y: parseInt(element.TotalUpvotes), label: element.hashtag, color: '#A0CFEE' })
            }

            setTopHashtags(temp)

        })

        socket.on('datamongo', (data) => {

            let temp = []
            let index = 0

            console.log(data.tophashtags)

            for (const key in data.tophashtags) {
                const element = data.tophashtags[key];

                if (index === 0) temp.push({ y: parseInt(element), label: key, color: '#1D9BF0' })
                if (index === 1) temp.push({ y: parseInt(element), label: key, color: '#898383' })
                if (index === 2) temp.push({ y: parseInt(element), label: key, color: '#0E3B59' })
                if (index === 3) temp.push({ y: parseInt(element), label: key, color: '#C2C9CD' })
                if (index === 4) temp.push({ y: parseInt(element), label: key, color: '#A0CFEE' })
                else if (index > 4) return

                index++

                setTopHashtags(temp)
            }

            index = 0

        })

    }, [topHashtags]);


    const options = {
        title: {
            text: "TOP HASHTAGS"
        },
        data: [{
            type: "pie",
            startAngle: 75,
            showInLegend: "true",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}",
            dataPoints: topHashtags
        }]

    }


    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );


}