import './Settings.css';
import React, {useEffect, useState, useContext} from 'react';
import { myContext } from '../Context';
import Users from '../Users/Users';
import axios from 'axios';

export default function Settings() {

    const ctx = useContext(myContext);
 
    const [stationList, setStationList] = useState([]);
    const [preferedStationList, setPreferedStationList] = useState([]);
    const [showUsersModal, setShowUsersModal] = useState(false);

    const [userSettings, setUserSettings] = useState({
        Pressure: ctx.pressure,
        Temperature: ctx.temperature,
        Humidity: ctx.humidity
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
    }, [])

    const handleToggleUsersModal = () => {
        setShowUsersModal(!showUsersModal);
    };

    const handleChangeStation = (itemId) => {
        const updatedList = preferedStationList.map(station => {
            if (station.StacjaPomiarowaIdUrządzenia === itemId) {
                return { ...station, Preferowana: station.Preferowana === 0 ? 1 : 0 };
            }
            return station;
        });
        setPreferedStationList(updatedList);
    };

    const handleUpdateSettings = () => {
        axios.post("http://localhost:5001/upload", {
            id: ctx.id,
            temperature: userSettings.Temperature, 
            humidity: userSettings.Humidity,
            pressure: userSettings.Pressure,
            stationList: preferedStationList
        }, {
            withCredentials: true
        }).then((res) => {
            if(res.status === 200) {
                window.location.reload();
            }
        })
    }

    if(!stationList || stationList.length === 0 || !preferedStationList || preferedStationList.length === 0) {
        return <div>Ładowanie...</div>; 
    }

    return(
        <>
        {showUsersModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <Users 
                    handleToggleUsersModal={handleToggleUsersModal}
                    />
                </div>
            </div>
        )}
        <div style={{ marginLeft: "2rem", marginRight: "2rem", fontFamily: "'Montserrat', sans-serif"}} className='signup-box-settings'>
            <div className='content-settings'>
                <h1 style={{textAlign: "center"}} className='settings-title'>Ustawienia</h1>
                <form style={{display: "flex", flexDirection: "column"}} className='settings-form'>
                    <label style={{marginTop: "1.5rem", fontWeight: "550", fontSize: "20px"}} className='label-settings'>Nazwa użytkownika</label>
                    <span style={{fontSize: "15px", marginTop: "0.2rem"}}>{ctx.username}</span>
                    <label style={{marginTop: "1.5rem", fontWeight: "550", fontSize: "20px"}} className='label-settings'>Email</label>
                    <span style={{marginBottom: "1rem", fontSize: "15px", marginTop: "0.2rem"}}>{ctx.email}</span>
                </form>
                <p style={{fontWeight: "550"}} className='label-settings'>Preferowane dane pomiarowe</p>
                <div style={{fontWeight: "550", display: "flex", justifyContent: "space-between"}} className='checkbox-container-settings'>
                <div className="custom-checkbox">
                    <input type="checkbox" checked={userSettings.Pressure} onChange={(e) => setUserSettings(prevState => ({ ...prevState, Pressure: e.target.checked }))} name="Pressure" />
                    <span className="checkmark"></span>
                    <label>Ciśnienie</label>
                </div>
                <div className="custom-checkbox">
                    <input type="checkbox" checked={userSettings.Temperature} onChange={(e) => setUserSettings(prevState => ({ ...prevState, Temperature: e.target.checked }))} name="Temperature" />
                    <span className="checkmark"></span>
                    <label>Temperatura</label>
                </div>
                <div className="custom-checkbox">
                    <input type="checkbox" checked={userSettings.Humidity} onChange={(e) => setUserSettings(prevState => ({ ...prevState, Humidity: e.target.checked }))} name="Humidity" />
                    <span className="checkmark"></span>
                    <label>Wilgotność</label>
                </div>
            </div>
                    <p style={{marginTop: "1.5rem", fontWeight: "550"}} className='label-settings'>Preferowane stacje pomiarowe</p>
                    <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            marginTop: "1.2rem"
        }} className='prefered-stations-settings'>
            {stationList.length > 0 ?
                stationList.map((item, index) => {
                    const isPreferred = preferedStationList.some(station => station.StacjaPomiarowaIdUrządzenia === item.IdUrządzenia && station.Preferowana);
                    return (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                        }} key={index}>
                            <input type='checkbox' onChange={() => handleChangeStation(item.IdUrządzenia)} checked={isPreferred} />
                            <label style={{ fontWeight: "550" }}>
                                <span>{item.Miasto}</span>
                                <br />
                                <span>{item.Adres}</span>
                            </label>
                        </div>
                    );
                })
                :
                <p>N/A</p>
            }
        </div>
        <div style={{
                    display: "flex",
                    justifyContent: "center", 
                    marginTop: "1rem", 
                    }}>
                    <input style={{
                        marginTop: "1rem",
                        borderRadius: "10px",
                        color: "white",
                        backgroundColor: "black",
                        padding: "12px",
                        border: "none",
                        width: "25%",
                        cursor: "pointer",
                    }} onClick={handleUpdateSettings} type='button' value="Zapisz zmiany" />
                </div>
                    {ctx.admin ?
                    <div style={{marginBottom: "1rem", borderTop: "2px black solid"}} className='settings-manage-users'>
                        <p style={{fontWeight: "550"}} >Zarządzaj użytkownikami: </p>
                        <div onClick={handleToggleUsersModal} style={{backgroundColor: "#87bff2", 
                                     padding: "10px",
                                     borderRadius: "10px",
                                     marginLeft: "3rem",
                                     fontWeight: "550",
                                     cursor: "pointer"}} >Lista użytkowników</div>
                    </div>
                    :
                    <></>
                    }
            </div>
        </div>
        </>
    )
}
