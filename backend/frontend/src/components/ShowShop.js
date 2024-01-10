import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar.js";
import WelcomeBox from "./welcomebox.js";
import ItemCard from "./card.js"
import "../styles/ShowShop.css"
import SearchBar from "./SearchBar.js";
import { toast } from "react-toastify";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = 'http://127.0.0.1:8080'

const ShowShop = (props) => {
    const prevBasket = JSON.parse(localStorage.getItem('basket')) || [];
    const [items, setItems] = useState([]);
    const [basket, setBasket] = useState([...prevBasket]);

    // Adds items to basket
    const addToBasket = (item) => {
        const newBasket = [...basket, item];
        setBasket(newBasket)
        localStorage.setItem('basket', JSON.stringify(newBasket))
    };

    // Handle search
    const handleSearch = (query) => {
        const apiEndpoint = query
        ? `api/items/?available=true&title=${query}`
        : 'api/items/?available=true';

        axios.get(apiEndpoint)
        .then(response => {
            setItems(response.data)
        })
        .catch(error => {
            console.error(error)
        })
    }

    useEffect(() => {
        const toastMessage = sessionStorage.getItem('toBeAdded')
        if (toastMessage){
            const parsedItem = JSON.parse(toastMessage)
            addToBasket(parsedItem);
            toast.success("Added item successfully")
            sessionStorage.removeItem('toBeAdded')
        }
    })

    useEffect(() => {
        //Gets all items available for sale (available=true)
        axios.get('http://localhost:8080/api/items/?available=true')
        .then(response => {
            setItems(response.data)
            console.log(response.data)
        })
        .catch(err => {
            console.error(err)
        })
    }, []);
    
    console.log("Items in basket: ",basket)
    return(
        <div>
            <NavBar basket={basket} handleUpdate={setBasket}/>
            <WelcomeBox/>
            <SearchBar onSearch={handleSearch} />
            <ItemCard items={items} setToBasket={addToBasket}/>
        </div>
    )
}

export default ShowShop