import { useState, useEffect, useRef, useContext } from 'react';
import './Home.css';
import "leaflet/dist/leaflet.css";
import { IoSettingsOutline } from "react-icons/io5";
import Settings from "../Settings/Settings";
import Stationformula from '../Stationformula/Stationformula';
import Removestation from '../Removestation/Removestation';
import Allstations from '../Allstations/Allstations';
import { myContext } from '../Context';
import Station from '../Station/Station';
import { Icon } from 'leaflet';
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/7945/7945007.png",
    iconSize: [32, 32]
});

export default function Home() {

    const ctx = useContext(myContext);

    let menuRef = useRef();

    const [stationList, setStationList] = useState([]);
    const [preferedStationList, setPreferedStationList] = useState([]);
    const [concatArray, setConcatArray] = useState([]);

    const [stationParams, setStationParams] = useState({
        stationId: null,
        stationName: null,
        stationCity: null
    })

    const [component, setComponent] = useState({
        settings: false,
        station: false,
        allStations: false,
        addStation: false,
        removeStation: false
    });

    useEffect(() => {
        axios.get("http://localhost:5001/stations", {
        }, {
            withCredentials: true
        }).then((res) => {
            if(res.status === 200) {
                setStationList(res.data);
            }
        });

        axios.post("http://localhost:5001/get_prefered_stations", {
            id: ctx.id
        }, {
            withCredentials: true
        }).then((res) => {
            if(res.status === 200) {
                setPreferedStationList(res.data);
            }
        })

    }, []);

    useEffect(() => {
        setConcatArray(
            stationList.filter(item =>
                preferedStationList.some(
                    station =>
                        station.StacjaPomiarowaIdUrządzenia === item.IdUrządzenia
                )
            )
        );
    }, [stationList, preferedStationList])

    useEffect(() => {
        let handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setComponent({ settings: false, station: false, addStation: false, removeStation: false });
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const logout = () => {
        axios.post("http://localhost:5001/logout", {
        }, {
            withCredentials: true
        }).then((res) => {
            if(res.data === "Succesfully logged out") {
                window.location.href = "http://localhost:3000/";
            }
        });
    };
    
    return (
        <div>
        {component.settings &&
         <div className="modal-background-home">
            <div ref={menuRef} style={{backgroundColor: "#e9e8ed"}} className="modal-container-home">
                <Settings/>
            </div>
        </div>
        }
        {component.station && (
            <div className="modal-background-home">
                <div ref={menuRef} style={{backgroundColor: "#f0f0f0"}} className="modal-container-home">
                    <Station stationId={stationParams.stationId} stationName={stationParams.stationName} stationCity={stationParams.stationCity}/>
                </div>
            </div>
        )}
        {component.allStations && (
            <div className="modal-background-home">
                <div ref={menuRef} style={{backgroundColor: "#f0f0f0"}} className="modal-container-home">
                    <Allstations concatArray={concatArray}/>
                </div>
            </div>
        )}
        {component.addStation && (
            <div className="modal-background-home">
                <div ref={menuRef} style={{backgroundColor: "white"}} className="modal-container-home">
                    <Stationformula/>
                </div>
            </div>
        )}
        {component.removeStation && (
            <div className="modal-background-home">
                <div ref={menuRef} style={{backgroundColor: "white"}} className="modal-container-home">
                    <Removestation/>
                </div>
            </div>
        )}
        <div className={`main-content-home ${component.settings || component.removeStation || component.allStations ||component.addStation || component.station ? 'blur' : ''}`}>
        <div style={{fontFamily: "'Montserrat', sans-serif"}}>
        <div className="top-buttons-home">
            <div className="left-buttons-home">
            {ctx.admin ?
                <>
                <button onClick={() => {
                    setComponent({addStation: true})
                }} className='button-home'>Dodaj Stację</button>
                <button onClick={() => {
                    setComponent({removeStation: true})
                }} className='button-home'>Usuń Stację</button>
                </>
            :
            <></>
            }
            </div>
            <div className="right-buttons-home">
                <div style={{fontWeight: "600", fontSize: "18px", paddingRight: "1.2rem"}} > 
                    Zalogowany: {ctx.username}
                </div>
                <button onClick={logout} className='button-home'>Wyloguj się</button>
                <IoSettingsOutline onClick={() => {
                    setComponent({settings: true})
                }} className='home-settings-icon'/>
            </div>
        </div>
        <div className='container-home'>
            <h1 style={{fontWeight: "700", fontSize: "50px"}} className='title-tag-home'>Aplikacja Pogodowa</h1>
            <p className='p-tag-home' style={{color: "#626162", fontSize: "18px"}}>Śledź stacje pomiarowe w całej Polsce</p>
            <div style={{ width: "96%", height: "50vh", margin: "0 auto", marginBottom: "20px" }}>
                <MapContainer style={{ width: "100%", height: "100%" }} center={[51.9189046, 19.1343786]} zoom={6} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
            stationList.map((item, index) => {
                const isPreferred = preferedStationList.some(station => station.StacjaPomiarowaIdUrządzenia === item.IdUrządzenia && station.Preferowana);    
                return isPreferred ? (
                    <Marker key={index} position={[item.Koordynata_x, item.Koordyanta_y]} icon={customIcon}>
                        <Popup>
                            {item.Miasto}, {item.Adres}. <br /> Stacja: {item.NazwaStacji}.
                        </Popup>
                    </Marker>
                ) : null;
            })
        }
                </MapContainer>
            </div>
        </div>
        <div>
            <p style={{textAlign: "center", fontWeight: "700", fontSize: "25px"}}>Stacje pomiarowe</p>
            <div className="boxes-home">
                    {
                        stationList.map((item, index) => {
                            const isPreferred = preferedStationList.some(station => station.StacjaPomiarowaIdUrządzenia === item.IdUrządzenia && station.Preferowana);
                            if(isPreferred) {
                                return (
                                <div key={index} className="box-home">
                                    <div className="content-home">
                                    <p className='station-names-home'>{item.Miasto} {item.Adres}</p>
                                    <p className='station-names-home'>Stacja: {item.NazwaStacji}</p>
                                </div>
                                <div onClick={() => {
                                    setComponent({station: true})
                                    setStationParams({
                                        allStations: false,
                                        stationId: item.IdUrządzenia,
                                        stationName: item.NazwaStacji,
                                        stationCity: item.Miasto
                                    })
                                }}className="wizualizacja-box">Wizualizacja
                                </div>
                                </div>
                                )
                            }
                        })
                    }
                    <div className="box-home">
                                    <div className="content-home">
                                    <p className='station-names-home'>Wyświetl Wszystkie</p>
                                    <p className='station-names-home'>Preferowane Stacje</p>
                                </div>
                        <div onClick={() => {
                            setComponent({allStations: true})
                        }} className="wizualizacja-box">Wizualizacja
                        </div>
                    </div>
            </div>
        </div>
        </div>
        </div>
        </div>
    )
}