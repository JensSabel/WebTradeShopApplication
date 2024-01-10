import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import axios from 'axios'
import { useNavigate } from 'react-router-dom';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = 'http://127.0.0.1:8080'

export default function WelcomeBox() {

  const navigate = useNavigate();

  const onClick = async () => {
    try {
      await axios.get('populate_database/').then( response => {
        alert('Databased populated successfully!');
        navigate('/');
      })
    } catch (err) {
      console.error(err)
    }
  }

    return(
    <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
            paddingTop: 15,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Traders Forum Webshop
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Welcome to the Traders forum! Here you can see items currently being sold by
              some of the users of this website! Please, have a look!
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
                <Typography sx={{paddingTop:1}}>Automatic DB population for assignment: </Typography>
                <Button variant="contained" onClick={onClick}>Render Users and Items</Button>
            </Stack>
          </Container>
        </Box>
    );
}

