import { useState, useEffect, useRef } from 'react';
import './Frontpage.css';
import Register from '../Register/Register';
import Login from '../Login/Login';
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

export default function Frontpage() {

    const [stationListFront, setStationListFront] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5001/stations", {
        }, {
            withCredentials: true
        }).then((res) => {
            if(res.status === 200) {
                setStationListFront(res.data.slice(0,3));
            }
        });
    }, [])

    const [component, setComponent] = useState({
        register: false,
        login: false,
    });

    let menuRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setComponent({ register: false, login: false });
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const customIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/7945/7945007.png",
        iconSize: [32, 32]
    });

    return (
        <>
        {component.register &&
         <div className="modal-background">
            <div ref={menuRef} className="modal-container">
                <Register setComponent={setComponent} />
            </div>
        </div>
        }
        {component.login && (
            <div className="modal-background">
                <div ref={menuRef} className="modal-container">
                    <Login />
                </div>
            </div>
        )}
        <div className={`main-content ${component.register || component.login ? 'blur' : ''}`}>
        <div style={{fontFamily: "'Montserrat', sans-serif"}}>
        <div className="top-buttons">
            <button onClick={() => {
                setComponent({login: true})
            }} className='front-page-button'>Zaloguj się</button>
            <button onClick={() => {
                setComponent({register: true})
            }} className='front-page-button'>Zarejestruj się</button>
        </div>
        <div className='container-front-page'>
            <h1 style={{fontWeight: "700", fontSize: "50px"}} className='title-tag-front-page'>Aplikacja Pogodowa</h1>
            <p className='p-tag-fron-page' style={{color: "#626162", fontSize: "18px"}}>Śledź stacje pomiarowe w całej Polsce</p>
            <div style={{ width: "96%", height: "50vh", margin: "0 auto", marginBottom: "20px" }}>
                <MapContainer style={{ width: "100%", height: "100%" }} center={[51.9189046, 19.1343786]} zoom={6} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                    stationListFront.map((item, index) => (
                        <Marker key={index} position={[item.Koordynata_x, item.Koordyanta_y]} icon={customIcon}>
                            <Popup>
                                {item.Miasto}, {item.Adres}. <br /> Stacja: {item.NazwaStacji}.
                            </Popup>
                        </Marker> 
                    ))}
                </MapContainer>
            </div>
        </div>
        <div>
            <p style={{marginTop: "2rem", marginLeft: "2.5rem", fontWeight: "700", fontSize: "25px"}}>Przykładowe stacje pomiarowe:</p>
            <div style={{ display: "flex", justifyContent: "center" }} className="boxes">
                {stationListFront.length > 0 ?
                    stationListFront.map((item, index) => (
                        <div key={index} className="box">
                            <p className='station-names'>{item.Miasto}, {item.Adres}</p>
                            <p className='station-names'>Stacja: {item.NazwaStacji}</p>
                        </div>
                    ))
                    :
                    <p>N/A</p>
                }
            </div>
        </div>
        <p style={{marginTop: "2rem", marginLeft: "2.5rem", fontSize: "25px", fontWeight: "700"}}>
            Więcej dla zalogowanych użytkowników:</p>
        <ul style={{marginLeft: "2.5rem", lineHeight: "130%", fontWeight: "bald", fontSize: "20px"}}>
            <li>Podgląd rozmieszczenia stacji pomiarowych</li>
            <li>Dostęp do wizualizacji danych pomiarowych</li>
            <li>Możliwość śledzenia tylko wybranych danych pomiarowych</li>
            <li>Możliwość śledzenia tylko wybranych stacji pomiarowych</li>
        </ul>
        </div>
        </div>
        </>
    )
}