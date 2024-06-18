import './Login.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function Login() {

    const [disabled, setDisabled] = useState(true);
    
    const [values, setValues] = useState({
        name: "",
        password: "",
    })    

    const [response, setResponse] = useState({
        unauthorized: false,
        badRequest: false
    });
    
    const login = () => {
        axios.post("http://localhost:5001/login", {
            username: values.name,
            password: values.password
        }, {
            withCredentials: true
        }).then((res) => {
            if(res.status === 200) {
                window.location.href = "http://localhost:3000/home";
            }
        }).catch(function(error) {
            if(error.response.data === 400) {
                setResponse({ badRequest: true });
            } else if(error.response.data === 401) {
                setResponse({ unauthorized: true });
            }
        });
    };

    useEffect(() => {
        const isEmpty = Object.values(values).some(val => val === "");
        setDisabled(isEmpty);
    }, [values]); 
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setValues((prev) => {
            return {...prev, [name]: value};
        });
    };

    function handleKeyPressLogin(event) {
        if(event.key === "Enter" && !disabled) {
            login();
        }
    };
         
    return(
        <div onKeyDown={handleKeyPressLogin} className='signup-box-login'>
            <h2 className='login-title'>Zaloguj się</h2>
            <p className='login-p'>Podaj nazwę użytkownika i hasło aby się zalogować</p>
            <form className='login-form'>
                {response.badRequest || response.unauthorized ?
                    <label style={{color: "red"}} className='label-login'>Niepoprawne hasło, nazwa użytkownika lub użytkownik zablokowany.</label>
                    :
                    <></>
                }
                <input type='text' name='name' placeholder='Nazwa użytkownika' onChange={handleChange}></input>
                <input type='password' name="password" placeholder='Hasło' onChange={handleChange}></input>
                <input onClick={login} style={disabled ? {backgroundColor: "#4D4D4D"} : {backgroundColor: "black"}} type='button' value="ZALOGUJ SIĘ" disabled={disabled}></input>
            </form>
        </div>
    )
}
