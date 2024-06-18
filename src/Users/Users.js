import "./Users.css";
import React, {useState, useEffect} from "react";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

export default function Users({ handleToggleUsersModal }) {

    const [users, setUsers] = useState([]);

    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [showDropdown, setShowDropdown] = useState(false);

    const blockUser = (id) => {
        axios.post("http://localhost:5001/block_user", {
            userId: id  
        }, {
            withCredentials: true  
        }).then(res => {
            
        }).catch(error => {
            
        });
    };

    const unlockUser = (id) => {
        axios.post("http://localhost:5001/unlock_user", {
            userId: id  
        }, {
            withCredentials: true  
        }).then(res => {
            
        }).catch(error => {
            
        });
    };
    
    const rankUser = (id) => {
        axios.post("http://localhost:5001/rank_user", {
            id: id  
        }, {
            withCredentials: true 
        }).then(res => {
            
        }).catch(error => {
    
        });
    };

    const degradeUser = (id) => {
        axios.post("http://localhost:5001/degrade_user", {
            id: id  
        }, {
            withCredentials: true 
        }).then(res => {
            
        }).catch(error => {
    
        });
    };
    
    useEffect(() => {
        axios.get("http://localhost:5001/get_users", {
            withCredentials: true
        }).then(res => {
            if(res.status === 200) {
                setUsers(res.data);
            }
        })   

    },[blockUser, rankUser, degradeUser, unlockUser])

    const handleHideDropdown = () => {
        setShowDropdown(false);
    };

    const handleShowDropdown = (event, index) => {
        event.preventDefault();
    
        const boundingRect = event.target.getBoundingClientRect();
        
        const topPosition = boundingRect.bottom + (boundingRect.height / 2);
        
        const leftPosition = boundingRect.right;
        
        setDropdownPosition({ top: topPosition, left: leftPosition });
        
        setShowDropdown(index);
    };

    if (!users || users.length === 0) {
        return <div>Ładowanie...</div>; 
    }

    return (
        <>
        <div style={{fontFamily: "'Montserrat', sans-serif", minWidth: "500px"}} >
            <div style={{display: "flex", justifyContent: "space-between"}} >
                <h3>Lista użytkowników</h3>
                <IoClose onClick={() => handleToggleUsersModal()} style={{cursor: "pointer", fontSize: "25px"}} />
            </div>
            <div style={{display: "flex", flexDirection: "column", maxHeight: "500px", overflowY: "scroll"}} >
            <div style={{color: "#909090", display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: "1px black solid"}}>
                <p>nazwa użytkownika</p>
                <p>e-mail</p>
                <p>opcje</p>
            </div>
            {users.map((item, index) => (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: "1px black solid"}} key={index}>
            <p style={{fontWeight: "550", fontSize: "15px"}} >{item.NazwaUżytkownika}</p>
            <p style={{fontWeight: "550", fontSize: "15px"}}>{item.Email}</p>
            <BsThreeDots onClick={(e) => handleShowDropdown(e, index)} style={{cursor: "pointer", fontSize: "25px"}} />
            {showDropdown === index && (
                <div className="dropdown-menu-users" style={{ backgroundColor: "#f1f1f1", 
                                                    zIndex: "9999", 
                                                    color: "black", 
                                                    borderRadius: "10px",
                                                    position: 'absolute', 
                                                    top: dropdownPosition.top, 
                                                    left: dropdownPosition.left, 
                                                    transform: 'translateY(-50%)', 
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}> 
                    <IoClose onClick={handleHideDropdown} style={{display: "flex", marginLeft: "auto", cursor: "pointer", fontSize: "20px"}}/>
                    
                    {item.Zablokowany ?
                    <div onClick={() => {
                        unlockUser(item.IdUżytkownika)
                    }} style={{borderBottom: "1px solid black",
                        paddingBottom: "0.5rem",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                        cursor: "pointer",
                        fontSize: "15px"
                    }}>Odblokuj użytkownika</div>  
                    :
                    <div onClick={() => blockUser(item.IdUżytkownika)} style={{borderBottom: "1px solid black",
                        paddingBottom: "0.5rem",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                        cursor: "pointer",
                    fontSize: "15px"
                    }}>Zablokuj użytkownika</div> 
                    }

                    {item.Admin ?
                        <div onClick={() => {
                            degradeUser(item.IdUżytkownika)
                        }} style={{
                        marginTop: "0.5rem",
                        paddingBottom: "0.5rem",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                        cursor: "pointer",
                        fontSize: "15px"
                    }}>Odbierz rangę administratora</div> 
                    :
                    <div onClick={() => {
                        rankUser(item.IdUżytkownika)
                    }} style={{marginTop: "0.5rem",
                            marginBottom: "0.5rem",
                            cursor: "pointer",
                            marginLeft: "1rem",
                            marginRight: "1rem",
                            fontSize: "15px"
                    }}>Nadaj rangę administratora</div>
                    }
                </div>
            )}
        </div>
))}
        </div>
        </div>
        </>
    )
}