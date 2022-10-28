import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export default function StyledSnackbar({ xPos, yPos, status, title, onClose, open }) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={2000}
            anchorOrigin={{ vertical: yPos, horizontal: xPos }}
            onClose={onClose}
        >
            <Alert onClose={onClose} severity={status} color={status} sx={{ width: '100%', display: 'flex', alignItems:'center' }}>
                {title}
            </Alert>
        </Snackbar>
    );
}
