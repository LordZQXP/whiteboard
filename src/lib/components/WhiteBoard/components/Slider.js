import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import styles from '../index.module.scss';
const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider(props) {
    const [value, setValue] = React.useState(props?.value);

    const handleSliderChange = (event, newValue) => {
        if(newValue <5)
        return;
        setValue(newValue);
        props?.changeHandler(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        props?.changeHandler(event.target.value === '' ? '' : Number(event.target.value));
    };

    return (
        <Box sx={{ width: 280, marginBottom: "120px", backgroundColor:'white', display: props?.open ? "flex" : "none", boxShadow: open ? '0 0 10px #ccc' : 'none', position:'absolute', zIndex:'999999999999', paddingLeft:'5px', paddingRight:'5px', justifyContent:'center', alignItems:'center' }}>
            <Grid container spacing={2} alignItems="center" className={styles.slider}>
                <Grid item xs className={styles.slider}>
                    <Slider
                        value={typeof value === 'number' ? value : props?.min}
                        onChange={handleSliderChange}
                        max={20}
                        min={0}
                        step={1}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={value}
                        size="small"
                        aria-orientation='vertical'
                        onChange={handleInputChange}
                        inputProps={{
                            step: 1,
                            min: 5,
                            max: 20,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                        disabled
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
