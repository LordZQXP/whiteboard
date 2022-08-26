import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import LineWeightIcon from '@mui/icons-material/LineWeight';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider(props) {
    const [value, setValue] = React.useState(props?.value);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        props?.changeHandler(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        props?.changeHandler(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 5) {
            setValue(5);
        } else if (value > 20) {
            setValue(20);
        }
    };

    return (
        <Box sx={{ width: 250, marginBottom: "60px", display: props?.open ? "block" : "none", boxShadow: open ? '0 0 10px #ccc' : 'none', position:'absolute', zIndex:'999999999999', paddingLeft:'5px', paddingRight:'5px' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : props?.min}
                        onChange={handleSliderChange}
                        max={20}
                        min={5}
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
