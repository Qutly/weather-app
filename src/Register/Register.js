import './Register.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Register({setComponent}) {
    
    const [disabled, setDisabled] = useState(true);

    const [response, setResponse] = useState({
        success: false,
        alreadyExists: false
    });
    
    const [values, setValues] = useState({
        name: "",
        password: "",
        email: "",
    });    

    const register = () => {
        axios.post("http://localhost:5001/register", {
            username: values.name,
            password: values.password,
            email: values.email
        }, {
            withCredentials: true
        }).then(res => {
            if(res.status === 200) {
                setResponse({ success: true });
            }
        }).catch(function(error) {
            if(error.response.status === 409) {
                setResponse({ alreadyExists: true });
            }
        })
    }

    useEffect(() => {
        const isEmpty = Object.values(values).some(val => val === "");
        if(!isEmpty && re.test(values.email) && values.password.length >= 8 && values.name.length >= 3 && values.name.length <= 20) {
            setDisabled(false); 
        } 
        else {
            setDisabled(true);
        }
    }, [values]); 
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setValues((prev) => {
            return {...prev, [name]: value};
        });
    };

    function handleKeyPressRegister(event) {
        if(event.key === "Enter" && !disabled) {
            register();
        }
    }
     
    return(
        <div onKeyDown={handleKeyPressRegister} className='signup-box'>
            {response.success ? 
                <h2 style={{color: "green"}} className='register-title'>Rejestracja powiodła się!</h2>
                :
                <h2 className='register-title'>Zarejestruj się</h2>
            }
            <p className='register-p'>Wpisz nazwę użytkownika, hasło oraz e-mail aby się zarejestrować</p>
            <form className='register-form'>
                <label className='label-register'>Od 3 do 20 znaków.</label>
                <input type='text' name='name' placeholder='Nazwa użytkownika' onChange={handleChange} required></input>
                <label className='label-register'>Przynajmniej 8 znaków.</label>
                <input name="password" type='password' placeholder='Hasło' onChange={handleChange} required></input>
                {response.alreadyExists ?
                    <label style={{color: "red"}} className='label-register'>Konto z podanym e-mailem lub nazwą użytkownika już istnieje.</label>
                    :
                    <></>
                }
                <input type='email' name="email" placeholder='email@domena.pl' onChange={handleChange} required></input>
                {response.success ? 
                    <input onClick={() => {
                        setComponent({register: false})
                    }} style={{backgroundColor: "black"}}  type='button' value="ZAMKNIJ OKNO"></input>
                :
                    <input onClick={register} style={disabled ? {backgroundColor: "#4D4D4D"} : {backgroundColor: "black"}} type='button' value="ZAREJESTRUJ SIĘ" disabled={disabled}></input>
                }
                
            </form>
        </div>
    )
}