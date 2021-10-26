import React, { useState, useEffect } from 'react'
import socket from '../libs/socket'
import CanvasJSReact from '../assets/canvasjs.react';
//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default function App() {
    const [reporteDiario, setReporteDiario] = useState([]);

    useEffect(() => {

        socket.on('datamysql', (data) => {

            let uv = []
            let dv = []

            for (const element of data.upvotesvsdownvotes) {

                let dia = element.fecha.split('/')[0]
                let mes = element.fecha.split('/')[1]
                let anio = element.fecha.split('/')[2]

                uv.push({ x: new Date(parseInt(anio), parseInt(mes), parseInt(dia)), y: parseInt(element.upvotes) })
                dv.push({ x: new Date(parseInt(anio), parseInt(mes), parseInt(dia)), y: parseInt(element.downvotes) })

            }

            setReporteDiario([
                {
                    color: '#1D9BF0',
                    type: "stackedBar",
                    name: "Upvotes",
                    showInLegend: "true",
                    xValueFormatString: "DD, MMM",
                    yValueFormatString: "#,##0",
                    dataPoints: uv
                },
                {
                    color: '#898383',
                    type: "stackedBar",
                    name: "Dpwnvotes",
                    showInLegend: "true",
                    xValueFormatString: "DD, MMM",
                    yValueFormatString: "#,##0",
                    dataPoints: dv
                }
            ])

        })



        socket.on('datamongo', (data) => {

            let uv = []
            let dv = []

            for (const key in data.upvotesvsdownvotes[0]) {
                const item = data.upvotesvsdownvotes[0][key];

                let dia = key.split('/')[0]
                let mes = key.split('/')[1]
                let anio = key.split('/')[2]

                uv.push({ x: new Date(parseInt(anio), parseInt(mes), parseInt(dia)), y: parseInt(item) })
            }

            for (const key in data.upvotesvsdownvotes[1]) {
                const item = data.upvotesvsdownvotes[1][key];

                let dia = key.split('/')[0]
                let mes = key.split('/')[1]
                let anio = key.split('/')[2]

                dv.push({ x: new Date(parseInt(anio), parseInt(mes), parseInt(dia)), y: parseInt(item) })

            }

            setReporteDiario([
                {
                    color: '#1D9BF0',
                    type: "stackedBar",
                    name: "Upvotes",
                    showInLegend: "true",
                    xValueFormatString: "DD, MMM",
                    yValueFormatString: "#,##0",
                    dataPoints: uv
                },
                {
                    color: '#898383',
                    type: "stackedBar",
                    name: "Dpwnvotes",
                    showInLegend: "true",
                    xValueFormatString: "DD, MMM",
                    yValueFormatString: "#,##0",
                    dataPoints: dv
                }
            ])

        })



    }, [reporteDiario]);


    const options = {
        title: {
            text: "Upvotes vs Downvotes"
        },
        data: reporteDiario

    }


    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );


}