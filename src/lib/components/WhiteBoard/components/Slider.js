import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import LineWeightIcon from '@mui/icons-material/LineWeight';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider(props) {
    const [value, setValue] = React.useState(props?.value);

    const handleSliderChange = (event, newValue) => {
        if(newValue >5){
        setValue(newValue);
        props?.changeHandler(newValue);
        }
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
        <Box sx={{ width: 250 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <LineWeightIcon />
                </Grid>
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : props?.min}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={value}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
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
