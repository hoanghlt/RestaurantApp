import { TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import DeleteOutlineTwoToneIcon  from '@material-ui/icons/DeleteOutlineTwoTone';
import React, { useEffect, useState }  from 'react'
import { createAPIEndPoint, ENDPOINTS } from '../../api';
import Table from '../../layouts/Table';

export default function OrderList(props){

    const {setOrderMasterID, setOrderListVisibility, resetFormControls, setNotify} = props;

    const[orderList,  setOrderList] = useState([]);

    useEffect(() => {
        createAPIEndPoint(ENDPOINTS.ORDER).fetchAll()
            .then(res => {
                setOrderList(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    const showForUpdate = id  =>{
        setOrderMasterID(id);
        setOrderListVisibility(false);
    }

    const deleteOrder = id => {
        if(window.confirm('Are you sure to delete this record?'))
        {
            console.log(id);
            createAPIEndPoint(ENDPOINTS.ORDER).delete(id)
            .then(res => {
                setOrderListVisibility(false);
                setOrderMasterID(0);
                resetFormControls();
                setNotify({isOpen:true, message: 'Deleted  successfully.'});
            })
            .catch(err => console.log(err))
        }
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Order No.</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Payed With</TableCell>
                    <TableCell>Grand Total</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    orderList.map(item => (
                        <TableRow key={item.orderMasterID}>
                            <TableCell onClick={e => showForUpdate(item.orderMasterID)}>{item.orderNumber}</TableCell>
                            <TableCell onClick={e => showForUpdate(item.orderMasterID)}>{item.customer.customerName}</TableCell>
                            <TableCell onClick={e => showForUpdate(item.orderMasterID)}>{item.pMethod}</TableCell>
                            <TableCell onClick={e => showForUpdate(item.orderMasterID)}>{item.gTotal}</TableCell>
                            <TableCell>
                                <DeleteOutlineTwoToneIcon onClick={e => deleteOrder(item.orderMasterID)} color="secondary"/>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}