import React, {Fragment, useEffect, useState } from 'react'
import { useAppDispatch } from 'src/hooks'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import {  Box, Card, CardContent, CardHeader, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import NoData from 'src/@core/components/emptydata/NoData'

import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomSpinner from 'src/@core/components/custom-spinner'

import { formatDate, formatTime } from '../../../@core/utils/format'
import GetUserData from '../../../@core/utils/getUserData'
import { fetchStaffActivityLog } from '../../../store/apps/staffActivityLog/asyncthunk'
import { useStaffActivityLog } from '../../../hooks/useStaffActivityLog'
import { useStaff } from '../../../hooks/useStaff'
import { fetchStaffs } from '../../../store/apps/staff/asyncthunk'
import { userRoleObj } from '../staff/StaffTable'


 const dbTableObj = {
  'grading parameters': { icon: 'carbon:result', color: 'info' },
  'class': { icon: 'mdi:google-classroom', color: 'secondary' },

  subject: { icon: 'mdi:learn-outline', color: 'success' },
  'academic grades': { icon: 'carbon:result', color: 'info' },
  sessions: { icon: 'iwwa:year', color: 'primary' },
  'others': { icon: 'tdesign:system-log', color: 'success' }
}


const StaffActivityLog = () => {
    
  const dispatch = useAppDispatch()
  const [StaffData] = useStaff()
  const [StaffActivityLogData, loading, paging] = useStaffActivityLog()



  const [staffId, setStaffId] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)





  const handleChangeStaff = e => {
    Number(setStaffId(e.target.value))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(()=>{
    dispatch(fetchStaffs({ page: 1, limit: 300, key: '',  }))

     // eslint-disable-next-line 
  },[])



  useEffect(() => {
    dispatch(fetchStaffActivityLog({ page: page + 1, limit: 10, staffId }))

     // eslint-disable-next-line 
  }, [page, rowsPerPage, staffId])

  return (
    <Fragment>

<Card>
        <CardHeader title='Filter' />
        <CardContent>
          <Grid container spacing={12}>
          <Grid item xs={12} sm={3}>
              <CustomTextField
                select
                fullWidth
                label='Staff*'
                SelectProps={{ value: staffId, onChange: e => handleChangeStaff(e) }}
              >
                <MenuItem>Select Staff</MenuItem>
                {StaffData?.result?.map(item => (
                  <MenuItem key={item?.id} value={item?.id} sx={{textTransform: 'uppercase'}}>
                    {`${item?.firstName} ${item?.lastName}`}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            </Grid>
            </CardContent>
            </Card>


      <TableContainer component={Paper} sx={{ maxHeight: 840, mt: 15 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ minWidth: 80, }}>
                S/N
              </TableCell>
              <TableCell align='center' sx={{ minWidth: 150 }}>
                Table
              </TableCell>
              <TableCell align='center' sx={{ minWidth: 200 }}>
                Action
              </TableCell>

              <TableCell align='center' sx={{ minWidth: 150 }}>
                Staff Role
              </TableCell>
            
              <TableCell align='center' sx={{ minWidth: 150 }}>
                Date
              </TableCell>

             
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow className='text-center'>
                <TableCell colSpan={6}>
                  <CustomSpinner />
                </TableCell>
              </TableRow>
            ) : (

              // </Box>
              <Fragment>
                {StaffActivityLogData?.map((item, i) => (
                  <TableRow hover role='checkbox' key={item.id}>
                    <TableCell align='left'>{i + 1}</TableCell>
                    <TableCell align='left' sx={{ textTransform: 'uppercase', fontSize: '13px', }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CustomAvatar
                                skin='light'
                                sx={{ mr: 4, width: 30, height: 30 }}
                                color={dbTableObj[item?.table]?.color || dbTableObj['others']?.color }
                              >
                                <Icon icon={dbTableObj[item?.table]?.icon || dbTableObj['others'].icon } />
                              </CustomAvatar>
                              <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                                {item?.table || '--'}
                              </Typography>
                            </Box>
                          </TableCell>
                    <TableCell align='center' sx={{ textTransform: 'capitalize' }}>
                      {item?.action || '--'}
                    </TableCell>
                    <TableCell align='left' sx={{ textTransform: 'uppercase', fontSize: '13px', }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CustomAvatar
                                skin='light'
                                sx={{ mr: 4, width: 30, height: 30 }}
                                color={userRoleObj[item?.role].color || 'primary'}
                              >
                                <Icon icon={userRoleObj[item?.role].icon} />
                              </CustomAvatar>
                              <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                                {item?.role || '--'}
                              </Typography>
                            </Box>
                          </TableCell>
                    <TableCell align='center'>
                      {`${formatDate(item?.createdAt)}, ${formatTime(item?.createdAt)}`}

                    </TableCell>

                  </TableRow>
                ))}

                {StaffActivityLogData?.length === 0 && (
                  <tr className='text-center'>
                    <td colSpan={6}>
                      <NoData />
                    </td>
                  </tr>
                )}
              </Fragment>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        page={page}
        component='div'

        count={paging?.totalItems}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    </Fragment>
  )
}

export default StaffActivityLog
