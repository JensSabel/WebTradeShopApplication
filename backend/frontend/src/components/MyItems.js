import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { Container, Grid, Dialog, TextField } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = 'http://127.0.0.1:8080'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const MyItems = () => {
    // Check currently logged in user
    const [owner, setOwner] = useState();
    const [userItems, setUserItems] = useState([]); //On-Sale items
    const [userItemsOff, setUserItemsOff] = useState([]); //Off-Sale items

    // Gets the current user
    useEffect(() => {
        axios.get('http://127.0.0.1:8080/api/check-login/')
            .then(response => {
                setOwner(response.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [])

    // Get user items available for sale
    useEffect(() => {
        axios.get(`http://localhost:8080/api/items/?owner=${owner}&available=true`)
            .then(response => {
                setUserItems(response.data)
            }).catch(err => {
                console.error(err)
            })
    }, [owner])

    // Get user items not available for sale
    useEffect(() => {
        axios.get(`http://localhost:8080/api/items/?owner=${owner}&available=false`)
            .then(response => {
                setUserItemsOff(response.data)
            }).catch(err => {
                console.error(err)
            })
    }, [owner])

    // Checks for toast messages
    useEffect(() => {
        const toastMessage = sessionStorage.getItem('toastMessage')
        if (toastMessage) {
            toast.success(toastMessage);
            sessionStorage.removeItem('toastMessage')
        }
    })

    // Handle change of availability
    const handleAvailability = (e, itemId, availability) => {
        e.preventDefault()
        const scrollPosition = window.scrollY
        axios.put('update-availability/', { id: itemId, available: availability })
            .then(response => {
                sessionStorage.setItem('toastMessage', response.data.message);
                window.location.reload(true);
                window.scrollTo(0, scrollPosition);
            }).catch(error => {
                console.error(error)
            })
    }

    // Popup window (Dialog)
    const [open, setOpen] = React.useState(false)
    const [editedItem, setEditedItem] = React.useState({
        title: '',
        description: '',
        price: ''
    });

    // Handle edit item
    const handleEdit = (e) => {
        e.preventDefault();
        const scrollPosition = window.scrollY
        axios.put(`api/items/${editedItem.id}/`, editedItem)
            .then(response => {
                console.log(response.data)
                sessionStorage.setItem('toastMessage', `Item: ${editedItem.title}, was successfully updated!`);
                window.location.reload(true);
                window.scrollTo(0, scrollPosition);
            })
            .catch(error => {
                console.error(error)
            })
    }

    // Handling Edit Item
    const handleClickOpen = (e, item) => {
        e.preventDefault();
        setEditedItem({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price
        })
        setOpen(true);
    };
    // Handles closing of the shopping cart by the x button
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <NavBar />
            <>
                <Typography variant="h3" align="center" sx={{ paddingTop: 20 }}>Items for sale in your inventory:</Typography>
                <Container sx={{ py: 8 }} maxWidth="xl">
                    {userItems && userItems.length > 0 ? (
                        <Grid container spacing={4}>
                            <>
                                {userItems.map(item => (
                                    <Grid item key={item} xs={12} sm={6} md={3}>
                                        <Card
                                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                        >
                                            <CardMedia
                                                sx={{ height: 140 }}
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
                                                <Link to={`/item/${item.id}`}><Button size='small'>Show Item</Button></Link>
                                                <Button size="small" onClick={(e) => handleClickOpen(e, item)}>Edit Item</Button>
                                                <Button size="small" onClick={(e) => handleAvailability(e, item.id, false)}>Take off sale</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </>
                        </Grid>
                    ) : (
                        <Typography variant="h4" align="center" sx={{ paddingTop: 20 }}> You have no items available for sale!</Typography>
                    )}
                </Container>
            </>
            <div className="otherone">
                <Typography variant="h3" align="center" sx={{ paddingTop: 5 }}>Items not currently for sale in your inventory:</Typography>
                <Container sx={{ py: 8 }} maxWidth="xl">
                    {userItemsOff && userItemsOff.length > 0 ? (
                        <Grid container spacing={4}>
                            <>
                                {userItemsOff.map(item => (
                                    <Grid item key={item} xs={12} sm={6} md={3}>
                                        <Card
                                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                        >
                                            <CardMedia
                                                sx={{ height: 140 }}
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
                                                <Link to={`/item/${item.id}`}><Button size='small'>Show Item</Button></Link>
                                                <Button size="small" onClick={(e) => handleClickOpen(e, item)}>Edit Item</Button>
                                                <Button size="small" onClick={(e) => handleAvailability(e, item.id, true)}>Put on Sale</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </>
                        </Grid>
                    ) : (
                        <Typography variant="h4" align="center" sx={{ paddingTop: 20 }}> You have no items in the backlog!</Typography>
                    )}
                </Container>
            </div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth="md"
                fullWidth={true}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}> Edit Item </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <TextField
                        label="Title"
                        fullWidth
                        value={editedItem.title}
                        onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={editedItem.description}
                        onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                    />
                    <TextField
                        label="Price"
                        fullWidth
                        value={editedItem.price}
                        onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={(e) => handleEdit(e)} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}

export default MyItems