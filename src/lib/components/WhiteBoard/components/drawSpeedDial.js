import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Crop169Icon from '@mui/icons-material/Crop169';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CreateIcon from '@mui/icons-material/Create';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';

const actions = [
    { icon: <HorizontalRuleIcon alt="Line" style={{ rotate: '-45deg', color: 'black' }} />, name: 'LINE' },
    { icon: <Crop169Icon alt="Rectangle" style={{ color: 'black' }} />, name: 'RECTANGLE' },
    { icon: <RadioButtonUncheckedIcon style={{ color: 'black' }} />, name: 'ELLIPSE' },
    { icon: <ChangeHistoryIcon style={{ color: 'black' }} />, name: 'TRIANGLE' },
    { icon: <CreateIcon style={{ color: 'black' }} />, name: 'PENCIL' },
    { icon: <TitleRoundedIcon style={{ color: 'black' }} />, name: 'TEXT' },
]; 

export default function OpenDrawSpeedDial(props) {
    return (
        <Box>
            <SpeedDial
                ariaLabel="SpeedDial openIcon example"
                icon={<SpeedDialIcon openIcon={<CreateIcon />} />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={()=>props?.toolCommander(action.name, props?.canvas)}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}
