import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import socket from '../libs/socket'

const IOSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#52d869',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

export default function CustomizedSwitche() {
    const [baseState, setBaseState] = useState(false)

    const handleChange = (event) => {
        setBaseState(event.target.checked)
        socket.emit('cambio', event.target.checked)
    };

    useEffect(() => {
        socket.on('val', (data) => {
            setBaseState(data)
        })

    }, [baseState]);

    return (
        <FormGroup>
            <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>Mysql Google Cloud</Grid>
                    <Grid item>
                        <IOSSwitch checked={baseState} onChange={handleChange} name="checkedC" />
                    </Grid>
                    <Grid item>Mongo cosmosdb</Grid>
                </Grid>
            </Typography>
        </FormGroup>
    );
}