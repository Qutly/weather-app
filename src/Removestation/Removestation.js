import "./Removestation.css";
import React, {useEffect, useState, useContext} from 'react';
import { myContext } from '../Context';
import axios from 'axios';

export default function Removestation() {

    const ctx = useContext(myContext);

    const [disabled, setDisabled] = useState(true);
    
    const [values, setValues] = useState({
        name: "",
        password: "",
    })    

    const [response, setResponse] = useState({
        badRequest: false
    });
    
    const remove = () => {
        axios.post("http://localhost:5001/remove_station", {
            id: ctx.id,
            name: values.name,
            password: values.password
        }, {
            withCredentials: true
        }).then(res => {
            if(res.data === "Stacja pomiarowa została pomyślnie usunięta") {
                window.location.reload();
            }
        }).catch(function(error) {
            if(error.response.status = (400 || 401 || 403 || 404 || 500)) {
                setResponse({ badRequest: true });
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

    function handleKeyPress(event) {
        if(event.key === "Enter" && !disabled) {
            remove();
        }
    };
         
    return(
        <div onKeyDown={handleKeyPress} className='signup-box-remove'>
            <h2 className='remove-p'>Podaj nazwę i potwierdź usunięcie stacji</h2>
            <form className='remove-form'>
                {response.badRequest ?
                    <label style={{color: "red"}} className='label-remove'>Usunięcie stacji nie powiodło się.</label>
                    :
                    <></>
                }
                <input type='text' name='name' placeholder='Nazwa Stacji' onChange={handleChange}></input>
                <input type='password' name="password" placeholder='Hasło' onChange={handleChange}></input>
                <input onClick={remove} type='button' value="ZATWIERDŹ" disabled={disabled}></input>
            </form>
        </div>
    )
}