import React, { useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { Box, CssBaseline, ThemeProvider, Typography, Container, Grid, Button, TextField, createTheme } from "@mui/material";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = 'http://127.0.0.1:8080'
const defaultTheme = createTheme();

const MyAccount = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        old_password: "",
        new_password1: "",
        new_password2: "",
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    
    const { old_password, new_password1, new_password2 } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handles password changes
    const onSubmit = async (e) => {
        e.preventDefault();

        if (new_password1 !== new_password2) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await axios.post("api/reset_password/", {
                old_password: old_password,
                new_password1: new_password1,
                new_password2: new_password2
            }).then(response => {
                toast.success(`Password change successful: ${response.data.message}`);
                navigate('/');
            })

        } catch (error) {
            alert("Error changing password!");
        }
    }
    return (
        <>
            <NavBar />
            <ThemeProvider theme={defaultTheme} />
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
                        Reset your password:
                    </Typography>
                    <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={onChange}
                                    name="old_password"
                                    required
                                    fullWidth
                                    id="old_password"
                                    label="Old Password"
                                    type={showPassword ? "text" : "password"}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={onChange}
                                    name="new_password1"
                                    required
                                    fullWidth
                                    id="new_password1"
                                    label="New Password"
                                    type={showPassword ? "text" : "password"}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={onChange}
                                    name="new_password2"
                                    required
                                    fullWidth
                                    id="new_password2"
                                    label="Repeat New Password"
                                    error={new_password1 !== new_password2}
                                    helperText={new_password1 !== new_password2 ? "Passwords do not match" : ""}
                                    type={showPassword ? "text" : "password"}
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary">
                            Change Password
                        </Button>
                        <Button
                            type="button"
                            onClick={handleTogglePassword}
                            color="primary"
                            sx={{ mt: 1 }}
                        >
                            {showPassword ? "Hide Password" : "Show Password"}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default MyAccount