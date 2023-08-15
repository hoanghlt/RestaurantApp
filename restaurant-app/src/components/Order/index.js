import { Grid } from '@material-ui/core';
import React from 'react';
import { useForm } from '../../hooks/useForm';
import OrderedFoodItem from './OrderedFoodItem';
import OrderForm from "./OrderForm";
import SearchFoodItem from './SearchFoodItem';

const generateOrderNumber = () => Math.floor(100000 + Math.random() * 900000).toString();

const getFreshModelObject = () =>(
    {
        orderMasterID : 0,
        orderNumber : generateOrderNumber(),
        customerID : 0,
        pMethod : 'none',
        gTotal : 0,
        deletedOrderItemIDs: '',
        orderDetails: []
    }
)

export default function Order()
{
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetFormControls
    } = useForm(getFreshModelObject);

    return(        
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <OrderForm 
                {...{values, setValues,
                        errors, setErrors, resetFormControls,handleInputChange}}
                />
            </Grid>

            <Grid item xs={6}>
                <SearchFoodItem 
                    {...{ values, setValues}}
                />
            </Grid>
            <Grid item xs={6}>
                <OrderedFoodItem 
                    {...{values, setValues}}
                />
            </Grid>
        </Grid>
    );
}