import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import PropTypes from 'prop-types'

import { AppBar, Toolbar, Typography, Tabs, Tab, Button, Dialog } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import '../styles/NavBar.css'
import { toast } from 'react-toastify';

import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.baseURL = 'http://127.0.0.1:8080'

// Added styling for the shopping cart
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const NavBar = (props) => {
  const location = useLocation();
  const [value, setValue] = useState(0); // To indicate the selected tab
  const [currentUser, setCurrentUser] = useState(); //Current user
  const navigate = useNavigate();

  const basket = props.basket // Shopping basket
  // Checks wether the user is logged in
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
  // Highlights where you are on the navbar
  React.useEffect(() => {
    switch (location.pathname) {
      case '/':
        setValue(0);
        break;
      case '/account':
        setValue(1);
        break;
      case '/myitems':
        setValue(2);
        break;
      case '/additem':
        setValue(3);
        break;
      default:
        setValue(0); // Set a default value if the route doesn't match any of the cases
    }
  }, [location.pathname]);

  // Logout functionality
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem('basket');
      await axios.post("api/logout");
      setCurrentUser(null);
      navigate('/');
    } catch (err) { console.error(err) }

  }

  // Shopping cart
  const [open, setOpen] = React.useState(false);
  const [totalPrice, setTotalPrice] = useState();
  // Handles opening of the shopping cart
  const handleClickOpen = () => {
    setOpen(true);
  };
  // Handles closing of the shopping cart by the x button
  const handleClose = () => {
    setOpen(false);
  };
  // This happens when you press the Buy Items button
  const handleBuy = () => {
    const updatedBasket = basket.map(item => ({ id: item.id, price: item.price }))
    console.log(updatedBasket)
    axios.put('update-basket/', { basket: updatedBasket })
      .then(response => {
        toast.success(response.data.message);
        props.handleUpdate([]);
        localStorage.removeItem('basket');
        setOpen(false);
      }).catch(error => {
        if (error.response && error.response.status === 410) {
          toast.error(error.response.data.message)
        } else if (error.response && error.response.status === 409) {
          toast.error(error.response.data.message)
          //TODO - Price adjusting of the basket
        } else {
          toast.error('An error occured while processin your request.')
        }
      })
  }

  // Shopping cart only visible on main shop page
  const showShoppingCartButton = location.pathname === '/'

  const handleRemoveItem = (index) => {
    const newBasket = [...basket];
    newBasket.splice(index, 1);
    props.handleUpdate(newBasket);
    localStorage.setItem('basket', JSON.stringify(newBasket));
  }

  // Calculates the total price for the items in the shopping cart
  useEffect(() => {
    if (location.pathname === '/') {
      const calculateTotalPrice = () => {
        const total = basket.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(total);
      }
      calculateTotalPrice();
    };
  }, [basket, location]);

  // Returns both the navbar component and the shopping cart component in the navbar,
  // Not the best approach to this but concidering to redo this part later if I have time
  return (
    <>
      <AppBar sx={{ background: "#063970" }}>
        <Toolbar>
          <StorefrontIcon id="storeIcon" />
          <Typography>Welcome to the Traders Guild!</Typography>

          {currentUser ? (
            <Tabs textColor="inherit" value={value} onChange={(e, value) => setValue(value)} indicatorColor='secondary'
              TabIndicatorProps={{ style: { backgroundColor: 'white' } }}>
              <Link to={'/'} className='navbarlink'><Tab label='Home'></Tab></Link>
              <Link to={'/account'} className='navbarlink'><Tab label='My Account'></Tab></Link>
              <Link to={'/myitems'} className='navbarlink'><Tab label='My Items'></Tab></Link>
              <Link to={'/additem'} className='navbarlink'><Tab label='Add Item'></Tab></Link>

              {showShoppingCartButton && (
                <Button onClick={handleClickOpen} sx={{ marginLeft: 'auto' }}>Shopping Cart</Button>
              )};

            </Tabs>
          ) : (
            <Tabs textColor="inherit" value={value} onChange={(e, value) => setValue(value)} indicatorColor='secondary'
              TabIndicatorProps={{ style: { backgroundColor: 'white' } }}>
              <Link to={'/'} className='navbarlink'><Tab label='Home'></Tab></Link>
            </Tabs>
          )}

          <div id='navbarbuttons'>
            {currentUser ? (
              <>
                <Typography>Logged in as: {currentUser}</Typography>
                <Link to='/'><Button onClick={handleLogout} variant="contained">Logout</Button></Link>
              </>
            ) : (
              <>
                <Link to='/login'><Button variant="contained">Login</Button></Link>
                <Link to={'/register'}><Button sx={{ marginLeft: '10px' }} variant="contained">Register</Button></Link>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Shopping Cart</DialogTitle>
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

          {basket && basket.length > 0 ? (
            <>
              {basket.map((item, index) => (
                <div key={item.id}>
                  {index + 1}
                  . {item.title}
                  , Price: {item.price}€
                  , Current owner: {item.owner}
                  <Button onClick={() => handleRemoveItem(index)}><DeleteIcon /></Button>
                </div>
              ))}
              <Typography gutterBottom variant='h6'>Total Price: {totalPrice}€</Typography>
            </>
          ) : (
            <Typography gutterBottom variant='h6'>No Items in the Shopping Cart!</Typography>
          )}

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleBuy}>
            Buy Items
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  )
};

NavBar.propTypes = {
  basket: PropTypes.array.isRequired,
  handleUpdate: PropTypes.func.isRequired,
}

export default NavBar;