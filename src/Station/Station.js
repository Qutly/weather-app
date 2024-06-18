import "./Station.css";
import React, { useEffect, useState, useContext } from "react";
import { myContext } from '../Context';
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement, 
    Title,
    Tooltip,
    Legend,
    LineElement
 } from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement, 
    LineElement,
    Title,
    Tooltip,
    Legend
) 

export default function Station({ stationId, stationName, stationCity }) {

    const ctx = useContext(myContext);

    const [dataStation, setDataStation] = useState(null);
    const [datasets, setDatasets] = useState({
        temperature: [],
        humidity: [],
        pressure: []
    }) 
    const [arrLabels, setArrLabels] = useState([]);
    const [error, setError] = useState(false);

    const isSameDate = (date1) => {

        date1 = new Date(date1);
        const date2 = new Date();

        return date1.getUTCFullYear() === date2.getUTCFullYear() &&
         date1.getUTCMonth() === date2.getUTCMonth() &&
         date1.getUTCDate() === date2.getUTCDate();
    }

    const getTime = (dataString) => {
        const newDate = new Date(dataString);
        const hours = String(newDate.getUTCHours()).padStart(2, '0');
        const minutes = String(newDate.getUTCMinutes()).padStart(2, '0');

        return hours + ":" + minutes;
    }

    const formatData = (dateString) => {
        
        const newDate = new Date(dateString);
        
        const year = newDate.getUTCFullYear();
        const month = String(newDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(newDate.getUTCDate()).padStart(2, '0');
        const hours = String(newDate.getUTCHours()).padStart(2, '0');
        const minutes = String(newDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(newDate.getUTCSeconds()).padStart(2, '0');

        let returnString = day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds;
        return returnString; 
    }

    useEffect(() => {
        axios.post("http://localhost:5001/get_measurement", {
            id: stationId
        }, {
            withCredentials: true
        }).then((res) => {
            if(res.status === 200) {
                
                const filteredTemperature = [];
                const filteredHumidity = [];
                const filteredPressure = [];
                const fixedLabales = [];

                res.data.forEach((item) => {
                    if (isSameDate(item.Czas)) {
                        filteredTemperature.push(item.Temperatura);
                        filteredHumidity.push(item.Wilgotność);
                        filteredPressure.push(item.Ciśnienie);
                        fixedLabales.push(getTime(item.Czas));
                    }
                });

                setDatasets({
                    temperature: filteredTemperature,
                    humidity: filteredHumidity,
                    pressure: filteredPressure
                });

                setDataStation(res.data);
                setArrLabels(fixedLabales);
            }
        }).catch(error => {
            if(error.response.status === (400 || 401 || 403 || 500)) {
                setError(true)
            }
        })
    }, [stationId])

    const dataTemperature = {
        labels: arrLabels,
        datasets: [
          {
            label: 'Temperatura',
            data: datasets.temperature, 
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
    };

    const dataHumidity = {
        labels: arrLabels,
        datasets: [
          {
            label: 'Wilgotność',
            data: datasets.humidity, 
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
    };

    const dataPressure = {
        labels: arrLabels,
        datasets: [
          {
            label: 'Ciśnienie',
            data: datasets.pressure, 
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
    };

    if (error) {
        return <div>Brak Dostępnych Danych</div>;
    }

    if (!dataStation || dataStation.length === 0) {
        return <div>Ładowanie...</div>;
    }

    const latestData = dataStation[dataStation.length - 1];

    return (
        <div className="station-content">
            <h1 style={{textAlign: "center", fontSize: "50px"}}>Stacja {stationName} Miasto {stationCity}</h1>
            <div className="container-station">
                <div style={{textAlign: "center"}} className="info-station">
                    <p style={{fontWeight: "550", fontSize: "25px"}} >Aktualne Dane</p>
                    <p style={{color: "#919090"}}>Stan na: {formatData(latestData.Czas)}</p>
                </div>
                {ctx.pressure ?
                <div className="box-station">
                    <p style={{fontWeight: "600", marginBottom: "1.5rem" }}>Ciśnienie</p>
                    <p style={{fontWeight: "600", fontSize: "30px"}} >{latestData.Ciśnienie} hPa</p>
                </div>
                :    
                    <></>
                }
                {ctx.temperature ?
                <div className="box-station">
                    <p style={{fontWeight: "600", marginBottom: "1.5rem" }}>Temperatura</p>
                    <p style={{fontWeight: "600", fontSize: "30px"}}>{latestData.Temperatura} *C</p>
                </div>
                :
                    <></>
                }
                {ctx.humidity ?
                <div className="box-station">
                    <p style={{fontWeight: "600", marginBottom: "1.5rem" }}>Wilgotność</p>
                    <p style={{fontWeight: "600", fontSize: "30px"}}>{latestData.Wilgotność} %</p>
                </div>
                :
                    <></>
                }
            </div>
            <div className="station-graphs" style={{ paddingTop: "3rem", display: "flex" }}>
                {ctx.pressure ?
                <div style={{ width: "60%", margin: "0 10px" }}>
                    <Line data={dataPressure} />
                </div>
                :
                    <></>
                }
                {ctx.temperature ?
                <div style={{ width: "60%", margin: "0 10px" }}>
                    <Line data={dataTemperature} />
                </div>
                :
                    <></>
                }
                {ctx.humidity ?
                <div style={{ width: "60%", margin: "0 10px" }}>
                    <Line data={dataHumidity} />
                </div>
                :
                    <></>
                }
            </div>
        </div>
    )}