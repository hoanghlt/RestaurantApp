import React, { useEffect, useState } from 'react';
import Form from "../../layouts/Form";
import { ButtonGroup, Grid, InputAdornment, makeStyles, Button as MuiButton} from "@material-ui/core";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import ReplayIcon from "@material-ui/icons/Replay";
import ReorderIcon from "@material-ui/icons/Reorder";
import { Input, Select, Button} from "../../controls";
import { createAPIEndPoint, ENDPOINTS } from '../../api';
import { roundTo2DecimalPoint } from '../../utils';
import Popup from '../../layouts/Popup';
import OrderList from './OrderList';
import Notification from '../../layouts/Notification';

const useStyles = makeStyles(theme => ({
    adornmentText: {
        '& .MuiTypography-root': {
            color: '#f3b33d',
            fontWeight: 'bolder',
            fontSize: '1.5em'
        }
    },
    submitButtonGroup: {
        backgroundColor: '#f3b33d',
        color: '#000',
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d'
        }
    }
}))

export default function OrderForm(props)
{
    const {values, setValues, errors, setErrors, resetFormControls, handleInputChange} = props;
    const classes = useStyles();

    const [customerList, setCustomerList] = useState([]);
    const [orderListVisibility, setOrderListVisibility] = useState(false);
    const [orderMasterID,  setOrderMasterID] = useState(0);
    const [notify, setNotify] =  useState({isOpen: false});

    useEffect(() => {
        createAPIEndPoint(ENDPOINTS.CUSTOMER).fetchAll()
        .then(res => {
            let customerList = res.data.map(item => ({
                id: item.customerID,
                title: item.customerName
            }));
            customerList = [{ id: 0, title: 'Select'}].concat(customerList);
            setCustomerList(customerList);
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        let gTotal  = values.orderDetails.reduce((tempTotal, item) => {
            return tempTotal + (item.quantity * item.foodItemPrice);
        },0);
        setValues({
            ...values,
            gTotal: roundTo2DecimalPoint(gTotal)
        })
    }, [JSON.stringify(values.orderDetails)]);

    useEffect(() => {
        if(orderMasterID ===  0) resetFormControls();
        else{
            createAPIEndPoint(ENDPOINTS.ORDER).fetchById(orderMasterID)
                .then(res => {
                    setValues(res.data);
                    setErrors({});
                })
                .catch(err => console.log(err))
        }
    }, [orderMasterID])
    
    const validateForm = () => {
        let temp = {};
        temp.customerID = values.customerID !== 0?"":"This field is required.";
        temp.pMethod  = values.pMethod !== "none"?"":"This field is required.";
        temp.orderDetails = values.orderDetails.length !== 0 ? "":"This field is required.";
        setErrors({...temp});
        return Object.values(temp).every(x => x==="");
    }

    const resetForm = () => {
        resetFormControls();
        setOrderMasterID(0);
    } 

    const submitOrder = e => {
        e.preventDefault();
        if(validateForm()){
            if(values.orderMasterID === 0)
            {
                createAPIEndPoint(ENDPOINTS.ORDER).create(values)
                .then(res => {                  
                    setNotify({isOpen:true, message: 'New  order  is created.'});
                    resetFormControls();
                })
                .catch(err => console.log(err));
            }     
            else
            {
                createAPIEndPoint(ENDPOINTS.ORDER).update(values.orderMasterID, values)
                    .then(res => {                        
                        setOrderMasterID(0);
                        setNotify({isOpen:true, message: 'New  order  is updated.'});
                    })
                    .catch(err => console.log(err));
            }       
        }        
    }

    const openListOfOrders = ()=> {
        setOrderListVisibility(true);
    }

    return(
        <>
            <Form onSubmit={submitOrder}>
                <Grid container>
                    <Grid item xs={6}>
                        <Input 
                            disabled 
                            label="Order Number" 
                            name="orderNumber" 
                            value = {values.orderNumber}
                            InputProps = {{
                                startAdornment: <InputAdornment 
                                    className={classes.adornmentText}
                                    position='start'>#</InputAdornment>
                            }}
                        />
                        <Select label="Customer"
                            name="customerID"
                            value={values.customerID}
                            onChange={handleInputChange}
                            options={customerList}
                            error={errors.customerID}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Select label="Payment Method"
                            name="pMethod"
                            value={values.pMethod}
                            onChange={handleInputChange}
                            options={[
                                {id: 'none', title: 'Select'},
                                {id: 'Cash', title: 'Cash'},
                                {id: 'Card', title: 'Card'}
                            ]}
                            error={errors.pMethod}/>
                        <Input 
                            disabled 
                            label="Grand Total" 
                            name="gTotal" 
                            value = {values.gTotal} 
                            InputProps = {{
                                startAdornment: <InputAdornment 
                                    className={classes.adornmentText}
                                    position='start'>$</InputAdornment>
                            }}
                        />    
                        <ButtonGroup className={classes.submitButtonGroup}>
                            <MuiButton 
                                size="large"
                                endIcon={<RestaurantMenuIcon />}
                                type="submit">Submit</MuiButton>
                            <MuiButton 
                                size="small"
                                onClick={resetForm}
                                startIcon={<ReplayIcon />}></MuiButton>
                        </ButtonGroup>    
                        <Button
                            size="large"
                            onClick={openListOfOrders}
                            startIcon={<ReorderIcon />}
                        >Orders</Button>        
                    </Grid>
                </Grid>
            </Form>
            <Popup title="List of Orders"
                openPopup={orderListVisibility}
                setOpenPopup={setOrderListVisibility}>
                    <OrderList 
                    {...{setOrderMasterID, setOrderListVisibility, resetFormControls, setNotify}}/>
            </Popup>
            <Notification 
                {...{notify, setNotify}}
            />
        </>
    );
}