
// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import * as React from 'react';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

// import Stack from '@mui/material/Stack'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const PageHeader = ({ toggle, action, handleFilter }) => {


  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end'

        // justifyContent: 'flex-end',
      }}
    >
     


    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <FormControl variant="standard">
        <Input
        onBlur={e => handleFilter(e.target.value)}
        placeholder='Search Staff'
          id="input-with-icon-adornment"
          startAdornment={
            <InputAdornment position="start">
              <Icon icon='fluent:people-search-20-filled' />
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>


      <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        {action}
      </Button>
    </Box>
  )
}

export default PageHeader
