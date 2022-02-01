import { Card, CardContent, Typography } from '@material-ui/core';
import "./InfoBox.css";
import React from 'react';

function InfoBox({title, cases, isRed, active, total, ...props}){
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
            <CardContent>
                {/* Title*/ }
                <Typography color="textSecondary">{title}</Typography>
                {/* Number of Cases*/}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
                {/* Total */}
                <Typography className="infoBox__total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    );
};

export default InfoBox;