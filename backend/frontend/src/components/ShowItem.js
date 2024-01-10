import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar.js";
import axios from "axios";
import { Box, Container, Card, CardContent, CardMedia, Typography, CardActions, Button } from "@mui/material";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = 'http://127.0.0.1:8080'

export default function ShowItem() {
    const params = useParams(); //Gets ID-param from url -> current item
    const [currentUser, setCurrentUser] = useState();
    const [item, setItem] = useState({
        title: "",
        description: "",
        price: 0,
        date_added: "",
        owner: "",
    });
    const navigate = useNavigate();
    const handleAdd = () => {
        sessionStorage.setItem('toBeAdded', JSON.stringify(item));
        navigate("/");
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:8080/api/check-login/')
          .then(response => {
            setCurrentUser(response.data);
          })
          .catch(error => {
            if (error.response && error.response.status === 403) {
              console.error("No user logged in!")
            } else {
              console.error("An error occured in checking login status");
            }
          });
      }, [])

    useEffect(() => {
        const fetchData = async () => {
            axios.get(`api/items/?id=${params.id}`)
            .then(response => {
                setItem(response.data[0])
            })
            .catch(error => {
                console.error(error)
            })
        }
        fetchData();
    }, [params.id])

    return (
        <>
            <NavBar />
            <h2>Item id is: {params.id}</h2>
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: 6,
                    paddingTop: 15,
                }}
            >
                <Container maxWidth="md">
                    <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <CardMedia
                            sx={{ height: 360 }}
                            image={require("../static/images/noimage.jpg")}
                            title="image"
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="h2">
                                {item.title}
                            </Typography>
                            <Typography>
                                {item.description}
                            </Typography>
                            <Typography variant='subtitle1' component="div">
                                Price: {item.price}€
                            </Typography>
                            <Typography variant='subtitle2' component="div">
                                Date Added: {item.date_added}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {currentUser && item.owner != currentUser ? (
                                <>
                                    <Button onClick={handleAdd} variant="contained">Add to Basket</Button>
                                    <Link to={'/'}><Button>Go Back</Button></Link>
                                </>
                            ): (
                                <Link to={'/'}><Button>Go Back</Button></Link>
                            )}  
                        </CardActions>
                    </Card>
                </Container>
            </Box>
        </>
    )
}