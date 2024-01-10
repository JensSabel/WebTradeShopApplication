import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { Container, Grid } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import PropTypes from 'prop-types'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = 'http://127.0.0.1:8080'

export default function ItemCard(props) {
  // Items to display
  const items = props.items
  // Navigate
  const navigate = useNavigate();

  // Handles add item functionality
  const handleAddItem = async (event, item) => {
    event.preventDefault();
    //User can't add own item to 
    await axios.get('http://127.0.0.1:8080/api/check-login/')
      .then(response => {
        const currentUser = response.data;
        if (currentUser === item.owner) {
          toast.error("Can't add Item that you already own!")
        } else {
          props.setToBasket(item)
          toast.success(`Item: "${item.title}", was added to basket`)
        }
      })
      .catch(err => {
        console.error(err);
        //Redirect to login page if the user is not logged in
        navigate('/login')

      });
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="xl">
      <Grid container spacing={4}>
        {items.map(item => (
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
                <Button size="small" onClick={(event) => handleAddItem(event, item)}>Add to Basket</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

ItemCard.propTypes = {
  items: PropTypes.array.isRequired,
  setToBasket: PropTypes.func.isRequired,
}