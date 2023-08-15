import { IconButton, InputBase, List, ListItem, ListItemText, Paper, makeStyles, ListItemSecondaryAction } from '@material-ui/core';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import PlusOneIcon from '@material-ui/icons/PlusOne'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import React, { useEffect, useState } from 'react';
import { createAPIEndPoint, ENDPOINTS } from '../../api';

const useStyles =makeStyles(theme => ({
    searchPaper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    searchInput: {
        marginLeft: theme.spacing(1.5),
        flex: 1
    },
    listRoot:{
        marginTop: theme.spacing(1),
        maxHeight: 300,
        overflow: 'auto',
        '& li:hover':{
            cursor: 'pointer',
            backgroundColor: '#E3E3E3'
        },
        '& li:hover .MuiButtonBase-root':{
            display: 'block',
            color: '#000'
        },
        '& .MuiButtonBase-root':{
            display: 'none'
        },
        '& .MuiButtonBase-root:hover':{
            backgroundColor: 'transparent   '
        }
    }
}))

export default function SearchFoodItem(props){

    const { values, setValues } = props;    
    const [foodItems, setFoodItems] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const classes = useStyles();

    let orderedFoodItems = values.orderDetails;

    const addFoodItem = foodItem =>{
        let x = {
            orderMasterID : values.orderMasterID,
            orderDetails: 0,
            foodItemID: foodItem.foodItemID,
            quantity: 1,
            foodItemPrice: foodItem.price,
            foodItemName: foodItem.foodItemName
        }
        setValues({
            ...values,
            orderDetails: [...values.orderDetails, x]
        })
    }    

    useEffect(()=>{
        createAPIEndPoint(ENDPOINTS.FOODITEM).fetchAll()
        .then(res => {
            setFoodItems(res.data);
            setSearchList(res.data);
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        let x = [...foodItems];
        x = x.filter(y => {
            return y.foodItemName.toLowerCase().includes(searchKey.toLocaleLowerCase())
                && orderedFoodItems.every(item => item.foodItemID !== y.foodItemID)
        });
        setSearchList(x);
    }, [searchKey, orderedFoodItems])

    return (
        <>
            <Paper className={classes.searchPaper}>
                <InputBase 
                    className={classes.searchInput}                    
                    onChange={e => setSearchKey(e.target.value)}
                    placeholder="Search food items"/>
                <IconButton>
                    <SearchTwoToneIcon />
                </IconButton>
            </Paper>
            <List className={classes.listRoot}>
                {
                    searchList.map((item, idx) => (
                        <ListItem key={idx} onClick={e=>addFoodItem(item)}>
                            <ListItemText 
                                primary = {item.foodItemName}
                                secondary = {'$'+item.price}/>
                            <ListItemSecondaryAction>
                                <IconButton onClick={e=>addFoodItem(item)}>
                                    <PlusOneIcon />
                                    <ArrowForwardIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem> 
                    ))
                } 
            </List>
        </>
    )
}