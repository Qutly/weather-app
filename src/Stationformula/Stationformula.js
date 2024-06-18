import "./Stationformula.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Stationformula() {

    const [disabled, setDisabled] = useState(true);

    const [values, setValues] = useState({
        name: "",
        country: "",
        city: "",
        address: "",
        lat: "",
        long: "",
    });

    const [response, setResponse] = useState({
        wrongFormat: false
    });

    const confirm = () => {
        axios.post("http://localhost:5001/add_station", {
            stationName: values.name, 
            country: values.country,
            city: values.city,
            address: values.address,
            lat: values.lat,
            long: values.long
        }, {
            withCredentials: true
        }).then(res => {
            if(res.status === 200) {
                window.location.reload();
            }
        }).catch(function(error) {
            if(error.response.status === 400) {
                setResponse({ wrongFormat: true });
            }
        })
    };

    useEffect(() => {
        const isEmpty = Object.values(values).some(val => val === "");
        setDisabled(isEmpty);
    }, [values]); 

    const handleChange = (e) => {
        const {name, value} = e.target;
        setValues((prev) => {
            console.log(values)
            return {...prev, [name]: value};
        });
    };

    function handleKeyPress(event) {
        if(event.key === "Enter" && !disabled) {
            confirm();
        }
    };

    return (
        <div onKeyDown={handleKeyPress} style={{marginLeft: "2rem", marginRight: "2rem", fontFamily: "'Montserrat', sans-serif"}}>
            <h1 style={{ borderColor: "#9a9a9a", borderBottom: "1px solid black", paddingBottom: "5px" }}>Dodaj stację pomiarową</h1>
            <div className="station-formula" style={{  display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", marginTop: "2rem", marginBottom: "1.5rem" }}>
                    <label htmlFor="nazwa" style={{ fontWeight: "550", color: "black", width: "100px" }}>Nazwa</label>
                    <input onChange={handleChange} name="name" id="nazwa" placeholder="Nazwa" style={{ flex: "1",
                                                                   border: "none",
                                                                   borderBottom: "1px solid black",
                                                                   background: "transparent",
                                                                   paddingBottom: "10px"}}/>
                </div>
                <div style={{ display: "flex", marginBottom: "1.5rem"  }}>
                    <label htmlFor="kraj" style={{fontWeight: "550", color: "black", width: "100px"}}>Kraj</label>
                    <input onChange={handleChange} name="country" id="kraj" placeholder="Kraj" style={{ flex: "1",
                                                                   border: "none",
                                                                   borderBottom: "1px solid black",
                                                                   background: "transparent",
                                                                   paddingBottom: "10px" }} />
                </div>
                <div style={{ display: "flex", marginBottom: "1.5rem"  }}>
                    <label htmlFor="miasto" style={{fontWeight: "550", color: "black",width: "100px" }}>Miasto</label>
                    <input onChange={handleChange} name="city" id="miasto" placeholder="Miasto" style={{ flex: "1",
                                                                   border: "none",
                                                                   borderBottom: "1px solid black",
                                                                   background: "transparent",
                                                                   paddingBottom: "10px" }} />
                </div>
                <div style={{ display: "flex", marginBottom: "1.5rem"  }}>
                    <label htmlFor="adres" style={{fontWeight: "550", color: "black",width: "100px" }}>Adres</label>
                    <input autocomplete="off" onChange={handleChange} name="address" id="adres" placeholder="Adres" style={{ flex: "1",
                                                                   border: "none",
                                                                   borderBottom: "1px solid black",
                                                                   background: "transparent",
                                                                   paddingBottom: "10px" }} />
                </div>
                <div style={{ display: "flex", marginBottom: "1.5rem"  }}>
                    <label htmlFor="szerokosc" style={{fontWeight: "550", color: "black", width: "100px"}}>Koord X</label>
                    <input autocomplete="off" onChange={handleChange} name="lat" id="szerokosc" placeholder="Szerokość" style={{ flex: "1",
                                                                   border: "none",
                                                                   borderBottom: "1px solid black",
                                                                   background: "transparent",
                                                                   paddingBottom: "10px" }} />
                </div>
                <div style={{ display: "flex", marginBottom: "1.5rem"  }}>
                    <label htmlFor="dlugosc" style={{fontWeight: "550", color: "black", width: "100px"}}>Koord Y</label>
                    <input autocomplete="off" onChange={handleChange} name="long" id="dlugosc" placeholder="Długość" style={{ flex: "1",
                                                                   border: "none",
                                                                   borderBottom: "1px solid black",
                                                                   background: "transparent",
                                                                   paddingBottom: "10px" }} />
                </div>
            </div>
            {response.wrongFormat ?
            <p style={{color: "red"}} >Błąd przy dodawaniu stacji</p>
            :
            <></>
            }
            <div style={{
                    display: "flex",
                    justifyContent: "center", 
                    }}>
                    <input onClick={confirm} style={{
                        marginTop: "2rem",
                        borderRadius: "10px",
                        color: "white",
                        backgroundColor: "black",
                        padding: "12px",
                        border: "none",
                        width: "50%",
                        cursor: "pointer",
                    }} type='button' value="Zatwierdź" disabled={disabled}/>
                </div>
        </div>
    )
} 