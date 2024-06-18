import "./Allstations.css";
import React, { useEffect, useState, useContext } from "react";
import { myContext } from '../Context';
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, LineElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Allstations({ concatArray }) {
    const ctx = useContext(myContext);

    const [stationsData, setStationsData] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); 
                const results = await Promise.all(concatArray.map(async (station) => {
                    try {
                        const res = await axios.post("http://localhost:5001/get_measurement", { id: station.IdUrządzenia }, { withCredentials: true });
                        return res.data;
                    } catch (error) {
                        console.error(`Error fetching data for station ${station.IdUrządzenia}:`, error);
                        return null; 
                    }
                }));
                const filteredResults = results.filter(res => res !== null); 
                setStationsData(filteredResults);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false); 
            }
        };
        fetchData();
    }, [concatArray]);

    const isSameDate = (date1) => {
        date1 = new Date(date1);
        const date2 = new Date();
        return date1.getUTCFullYear() === date2.getUTCFullYear() &&
               date1.getUTCMonth() === date2.getUTCMonth() &&
               date1.getUTCDate() === date2.getUTCDate();
    };

    const getTime = (dataString) => {
        const newDate = new Date(dataString);
        const hours = String(newDate.getUTCHours()).padStart(2, '0');
        const minutes = String(newDate.getUTCMinutes()).padStart(2, '0');
        return hours + ":" + minutes;
    };

    const formatData = (dateString) => {
        const newDate = new Date(dateString);
        const year = newDate.getUTCFullYear();
        const month = String(newDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(newDate.getUTCDate()).padStart(2, '0');
        const hours = String(newDate.getUTCHours()).padStart(2, '0');
        const minutes = String(newDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(newDate.getUTCSeconds()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    };

    if (error) {
        return <div>Brak Dostępnych Danych</div>;
    }

    if (loading) {
        return <div>Ładowanie...</div>; 
    }

    return (
        <div className="station-content-all">
            {concatArray.map((station, index) => {
                const stationData = stationsData[index];
                const filteredData = {
                    temperature: [],
                    humidity: [],
                    pressure: [],
                    labels: []
                };

                if (stationData) {
                    stationData.forEach(item => {
                        if (isSameDate(item.Czas)) {
                            filteredData.temperature.push(item.Temperatura);
                            filteredData.humidity.push(item.Wilgotność);
                            filteredData.pressure.push(item.Ciśnienie);
                            filteredData.labels.push(getTime(item.Czas));
                        }
                    });
                }

                const latestData = stationData ? stationData[stationData.length - 1] : null;

                const dataTemperature = {
                    labels: filteredData.labels,
                    datasets: [{
                        label: 'Temperatura',
                        data: filteredData.temperature,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                };

                const dataHumidity = {
                    labels: filteredData.labels,
                    datasets: [{
                        label: 'Wilgotność',
                        data: filteredData.humidity,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                };

                const dataPressure = {
                    labels: filteredData.labels,
                    datasets: [{
                        label: 'Ciśnienie',
                        data: filteredData.pressure,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                };

                return (
                    <div key={station.IdUrządzenia} className="station-container">
                        <h1 style={{textAlign: "center", fontSize: "50px"}}>Stacja {station.NazwaStacji} Miasto {station.Miasto}</h1>
                        <div className="container-station-all">
                            <div style={{ textAlign: "center" }} className="info-station-all">
                                <p style={{fontWeight: "550", fontSize: "25px"}}>Aktualne Dane</p>
                                {latestData && <p style={{color: "#919090"}}>Stan na: {formatData(latestData.Czas)}</p>}
                            </div>
                            {ctx.pressure && latestData &&
                                <div className="box-station-all">
                                    <p style={{fontWeight: "600", marginBottom: "1.5rem" }}>Ciśnienie</p>
                                    <p style={{fontWeight: "600", fontSize: "30px"}}>{latestData.Ciśnienie} hPa</p>
                                </div>
                            }
                            {ctx.temperature && latestData &&
                                <div className="box-station-all">
                                    <p style={{ fontWeight: "600", marginBottom: "1.5rem" }}>Temperatura</p>
                                    <p style={{fontWeight: "600", fontSize: "30px"}}>{latestData.Temperatura} *C</p>
                                </div>
                            }
                            {ctx.humidity && latestData &&
                                <div className="box-station-all">
                                    <p style={{ fontWeight: "600", marginBottom: "1.5rem" }}>Wilgotność</p>
                                    <p style={{fontWeight: "600", fontSize: "30px"}}>{latestData.Wilgotność} %</p>
                                </div>
                            }
                        </div>
                        <div className="station-graphs-all" style={{ paddingTop: "3rem", display: "flex" }}>
                            {ctx.pressure && <div style={{ width: "60%", margin: "0 10" }}><Line data={dataPressure} /></div>}
                            {ctx.temperature && <div style={{ width: "60%", margin: "0 10" }}><Line data={dataTemperature} /></div>}
                            {ctx.humidity && <div style={{ width: "60%", margin: "0 10" }}><Line data={dataHumidity} /></div>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
