import React, { useState } from 'react';
import '../styles/login.css';
import NavBar from './NavBar';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = 'http://127.0.0.1:8080'

const Login = () => {
    const [formData, setFormData] = useState({
        password: "",
        username: ""
    });

    const { password, username } = formData;

    const defaultTheme = createTheme();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const navigate = useNavigate();
    
    //Handles login submit of form
    const onSubmit = (e) => {
        e.preventDefault();
        const loginUser = {
            password,
            username
        };
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password,
                    username
                })
            };
            const body = JSON.stringify(loginUser);
            axios.post("api/login", body, config).then(response => {
                console.log(response.data);
                navigate('/') //Navigates to first page after successful login
                toast.success(`Successfully logged in user: ${loginUser.username}`)
            }).catch(err => {
                if (err.response && err.response.status === 404) {
                    // User not found error
                    toast.error("User not found. Please check your credentials.");
                } else {
                    // Other errors
                    toast.error("An error occurred during login.");
                    console.error(err);
                }
            })
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <NavBar />
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
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
                            <TextField
                                onChange={onChange}
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="user"
                                autoFocus
                            />
                            <TextField
                                onChange={onChange}
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <Button
                                onChange={onChange}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                </Grid>
                                <Grid item>
                                    <Link to="/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    );

}

export default Login;