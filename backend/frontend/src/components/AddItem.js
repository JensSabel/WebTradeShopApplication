import React, { useState } from "react";
import NavBar from "./NavBar";

import { Box, Button, Container, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = 'http://127.0.0.1:8080'
const defaultTheme = createTheme();

const AddItem = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        available: true,
      });

    const {title, description, price, available} = formData;
    
    const onChange = (e) => setFormData({...formData, [e.target.name]:e.target.value});
    
    const navigate = useNavigate();

    const availability = [
        {
            value: true,
            label: 'Yes'
        },
        {
            value: false,
            label: 'No'
        }
    ];

    const onSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            title,
            description,
            price,
            available
        };

        try {
            const config = {
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  title,
                  description,
                  price,
                  available
                })
              };
              const body = JSON.stringify(newItem);
              axios.post("api/items/", body, config).then(response => {
                console.log(response.data)
                navigate('/')
                toast.success(`Successfully added item: ${newItem.title}`)
              }).catch(error => {
                console.error(error)
                toast.error("Item could not be added to the store, please check the fields so that the data is correct!")
              })

        } catch (err) {
            console.error(err)
        }

    };
    
    return(
        <>
            <NavBar/>
            <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: 20,
                }}
            >
                <Typography component="h1" variant="h5">
                Add your item below! Also, choose if the item is currently available!
                </Typography>
                <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                            onChange={onChange}
                            name="title"
                            required
                            fullWidth
                            id="title"
                            label="Item Title"
                            autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            onChange={onChange}
                            name="description"
                            required
                            multiline
                            fullWidth
                            id="description"
                            label="Description"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            onChange={onChange}
                            name="price"
                            required
                            fullWidth
                            id="price"
                            label="Price €"
                            type="number"
                            helperText="Use '.' instead of ','"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                            id="available"
                            name="available"
                            select
                            fullWidth
                            label="Available"
                            defaultValue={true}
                            helperText="Is the item currently available?"
                            > 
                            {availability.map((option) => (
                                <MenuItem   key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>
                    </Grid>
                    <Button
                    onChange={onChange}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Add Item
                    </Button>
                </Box>
            </Box>
            </Container>
            </ThemeProvider>
        </>
    )
}

export default AddItem;