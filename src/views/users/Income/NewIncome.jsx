import React, { Fragment, useEffect, useState } from 'react'
import { useAppDispatch } from 'src/hooks'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import DeleteDialog from 'src/@core/components/delete-dialog'
import Icon from 'src/@core/components/icon'
import NoData from 'src/@core/components/emptydata/NoData'
import { styled } from '@mui/material/styles'
import CreateIncome from './CreateIncome'

import CustomSpinner from 'src/@core/components/custom-spinner'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import PageHeaderWithSearch from '../component/PageHeaderWithSearch'
import { useIncome } from '../../../hooks/useIncome'
import { fetchIncome } from '../../../store/apps/income/asyncthunk'

import { deleteClass, fetchClasses } from '../../../store/apps/classes/asyncthunk'

// import { fetchCurrentSession } from '../../../store/apps/currentSession/asyncthunk'
import { useCurrentSession } from '../../../hooks/useCurrentSession'
import { display } from '@mui/system'

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

const renderClient = row => {
  const initials = `${row.firstName} ${row.lastName}`
  if (row.profilePicture?.length) {
    return (
      <CustomAvatar
        src={`${backendURL?.replace('api', '')}/${row.profilePicture}`}
        sx={{ mr: 2.5, width: 38, height: 38 }}
      />
    )
  } else {
    return (
      <CustomAvatar
        skin='light'
        //eslint-disable-next-line
        // color={row?.title.length > 2 ? 'primary' : 'secondary'}
        color='primary'
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(initials || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const TableCellStyled = styled(TableCell)(({ theme }) => ({
  color: `${theme.palette.primary.main} !important`
}))

const IncomeTable = () => {
  // ** State
  const [page, setPage] = useState(0)
  const [key, setKey] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [showModal, setShowModal] = useState(false)
  const [refetch, setFetch] = useState(false)
  const [openEditDrawer, setEditDrawer] = useState(false)
  const [openDeleteModal, setDeleteModal] = useState(false)
  const [openPayModal, setOpenPayModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState()
  const [incomeToUpdate, setIncomeToUpdate] = useState(null)
  const [incomeToPay, setIncomeToPay] = useState(null)
  const [incomeInView, setIncomeInView] = useState(null)
  const [openViewModal, setOpenViewModal] = useState(false)
  const dispatch = useAppDispatch()

  const [IncomeData, loading, paging] = useIncome()
  const [CurrentSessionData] = useCurrentSession()

  // const [showModal, setShowModal] = useState(false)
  // const [openEditDrawer, setEditDrawer] = useState(false)
  // const [openViewDrawer, setViewDrawer] = useState(false)
  // const [deleteModal, setDeleteModal] = useState(false)
  // const [selectedClass, setSelectedClass] = useState()
  // const [ClassToUpdate, setClassToUpdate] = useState(null)
  // const [ClassInView, setClassInView] = useState(null)
  // const [key, setKey] = useState('')
  // const [openAssignModal, setAssignModal] = useState(false)
  // const [openPeriodModal, setPeriodModal] = useState(false)
  // const [openTimetableModal, setOpenTimeTable] = useState(false)
  // const [ClassToAssign, setClassToAssign] = useState(null)
  // const [ClassToViewTimeTable, setClassRoomToViewTimeTable] = useState(null)
  // const [ClassToAddPeriod, setClassRoomToAddPeriod] = useState(null)
  // const [assignSubject, setAssignSubject] = useState(false)
  const [anchorEl, setAnchorEl] = useState(Array(IncomeData?.length)?.fill(null))

  // const dateValue = new Date()
  // console.log(dateValue.getDay(), 'day')
  // console.log(dateValue.getDate().toString(), 'date to string')

  //Functions from ALl Income component
  // ** Hooks
  // const dispatch = useDispatch()

  // const [IncomeData, loading] = useIncome()

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const toggleViewModal = () => {
    setOpenViewModal(!openViewModal)
  }

  const setIncomeToView = value => {
    setOpenViewModal(true)
    setIncomeInView(value)
  }

  const updateFetch = () => setFetch(!refetch)

  const doDelete = value => {
    setDeleteModal(true)
    setSelectedStudent(value?.id)
  }

  const doCancelDelete = () => {
    setDeleteModal(false)
    setSelectedStudent(null)
  }

  const ondeleteClick = async () => {
    deleteStudent(selectedStudent).then(res => {
      if (res.status) {
        dispatch(fetchStudents({ page: 1, key }))
        doCancelDelete()
      }
    })
  }

  const setPayIncome = value => {
    setIncomeToPay(value)
    setOpenPayModal(true)
  }

  const togglePayModal = () => setOpenPayModal(!openPayModal)

  const setIncomeToEdit = value => {
    setEditDrawer(true)
    setIncomeToUpdate(value)
  }

  const closeEditModal = () => setEditDrawer(!openEditDrawer)

  useEffect(() => {
    dispatch(fetchIncome({ page: page + 1, key }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, page, key])

  //  functions from classes
  const handleRowOptionsClick = (event, index) => {
    const newAnchorEl = [...anchorEl]
    newAnchorEl[index] = event.currentTarget
    setAnchorEl(newAnchorEl)
  }

  const handleRowOptionsClose = index => {
    const newAnchorEl = [...anchorEl]
    newAnchorEl[index] = null
    setAnchorEl(newAnchorEl)
  }

  const OpenModal = () => {
    if (showModal) {
      setShowModal(false)
      setClassToUpdate(null)
    } else {
      setShowModal(true)
    }
  }

  const toggleAssignModal = () => {
    if (openAssignModal) {
      setAssignModal(false)
      setClassToAssign(null)
    } else {
      setAssignModal(true)
    }
  }

  const setClassToAssignSubject = value => {
    setAssignSubject(true)
    toggleAssignModal()

    handleRowOptionsClose(IncomeData?.indexOf(value))
    setClassToAssign(value)
  }

  const setClassToRemoveSubject = value => {
    setAssignSubject(false)
    toggleAssignModal()

    handleRowOptionsClose(IncomeData?.indexOf(value))
    setClassToAssign(value)
  }

  const setClassToAddPeriod = value => {
    setPeriodModal(true)

    handleRowOptionsClose(IncomeData?.indexOf(value))
    setClassRoomToAddPeriod(value)
  }

  const closePeriodModal = () => {
    setPeriodModal(false)
    setClassRoomToAddPeriod(null)
  }

  const setClassToViewTimeTable = value => {
    setOpenTimeTable(true)

    handleRowOptionsClose(IncomeData?.indexOf(value))
    setClassRoomToViewTimeTable(value)
  }

  const closeTimeTableModal = () => {
    setOpenTimeTable(false)
    setClassRoomToViewTimeTable(null)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const setClassToEdit = value => {
    handleRowOptionsClose(IncomeData?.indexOf(value))
    OpenModal()
    setClassToUpdate(value)
  }

  const setClassToView = value => {
    handleRowOptionsClose(IncomeData?.indexOf(value))
    setViewDrawer(!openViewDrawer)
    setClassInView(value)
  }

  const closeViewModal = () => {
    setViewDrawer(!openViewDrawer)
    setClassInView(null)
  }

  //eslint-disable-next-line
  // useEffect(() => {
  //   dispatch(fetchCurrentSession())

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    dispatch(fetchClasses({ page: page + 1, limit: 10, key }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, key])

  return (
    <>
      {/* <Stats data={IncomeData} statTitle='Classes'/> */}

      <PageHeaderWithSearch
        searchPlaceholder={'Search Income'}
        action='Create Income'
        toggle={toggleModal}

        // handleFilter={setKey}
      />
      <CreateIncome open={showModal} closeModal={toggleModal} fetchData={updateFetch} />

      <Fragment>
        <TableContainer component={Paper} sx={{ maxHeight: 840 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell align='left' sx={{ minWidth: 100 }}>
                  S/N
                </TableCell>
                <TableCell align='center' sx={{ minWidth: 180 }}>
                  Amount
                </TableCell>
                <TableCell align='center' sx={{ minWidth: 180 }}>
                  Amount Paid
                </TableCell>
                <TableCell align='center' sx={{ minWidth: 180 }}>
                  Category
                </TableCell>
                <TableCell align='center' sx={{ minWidth: 140 }}>
                  Payment Date
                </TableCell>
                <TableCell align='center' sx={{ minWidth: 140 }}>
                  Actions
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
                <Fragment>
                  {IncomeData?.length &&
                    IncomeData?.map((item, i) => {
                      return (
                        <TableRow hover role='checkbox' key={item.id}>
                          <TableCell align='left' sx={{ textTransform: 'uppercase' }}>
                            {`${item.id}` || '--'}
                          </TableCell>
                          <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                            {item?.amount || '--'}
                          </TableCell>
                          <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                            {item?.amountPaid || '--'}
                          </TableCell>
                          <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                            {item?.category?.name?.toUpperCase() || '--'}
                          </TableCell>
                          <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                            {`${new Date(item?.createdAt).toLocaleDateString()}` || '--'}
                          </TableCell>
                          <TableCell align='left' sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <>
                              <IconButton size='small' onClick={event => handleRowOptionsClick(event, i)}>
                                <Icon icon='tabler:dots-vertical' />
                              </IconButton>
                              <Menu
                                keepMounted
                                anchorEl={anchorEl[i]}
                                open={Boolean(anchorEl[i])}
                                onClose={() => handleRowOptionsClose(i)}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'right'
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right'
                                }}
                                PaperProps={{ style: { minWidth: '8rem' } }}
                              >
                                <MenuItem onClick={() => setClassToEdit(item, 'item')} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='tabler:edit' fontSize={20} />
                                  Edit Income
                                </MenuItem>

                                <MenuItem onClick={() => setClassToView(item)} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='tabler:eye' fontSize={20} />
                                  View Income
                                </MenuItem>

                                <MenuItem onClick={() => {}} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='ph:hand-coins-light' fontSize={20} />
                                  Pay Outstanding
                                </MenuItem>
                                <MenuItem onClick={() => doDelete(item)} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='tabler:trash' fontSize={20} />
                                  Delete Income
                                </MenuItem>
                                {/* {CurrentSessionData && (
                                  <MenuItem onClick={() => setClassToAddPeriod(item)} sx={{ '& svg': { mr: 2 } }}>
                                    <Icon icon='mdi:timetable' fontSize={20} />
                                    Add Period
                                  </MenuItem>
                                )}

                                <MenuItem onClick={() => setClassToViewTimeTable(item)} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='mdi:timetable' fontSize={20} />
                                  View Timetable
                                </MenuItem>
                                <MenuItem onClick={() => setClassToAssignSubject(item)} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='fluent:stack-add-20-filled' fontSize={20} />
                                  Assign Subject
                                </MenuItem>
                                <MenuItem onClick={() => setClassToRemoveSubject(item)} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='solar:notification-lines-remove-bold' fontSize={20} />
                                  Remove Subject
                                </MenuItem>*/}
                              </Menu>
                            </>
                          </TableCell>
                        </TableRow>
                      )
                    })}

                  {IncomeData?.length === 0 && (
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
          rowsPerPageOptions={[5, 10]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* {showModal && <ManageClass open={showModal} toggle={OpenModal} classToEdit={ClassToUpdate} />} */}

        {/* <DeleteDialog open={deleteModal} handleClose={doCancelDelete} handleDelete={ondeleteClick} />

        {openViewDrawer && <ViewClass open={openViewDrawer} closeCanvas={closeViewModal} classRoom={ClassInView} />} */}

        {/* <ManageClassSubject
          open={openAssignModal}
          Classroom={ClassToAssign}
          status={assignSubject}
          toggle={toggleAssignModal}
        /> */}

        {/* {openTimetableModal && (
          <ViewTimeTable open={openTimetableModal} handleClose={closeTimeTableModal} ClassRoom={ClassToViewTimeTable} />
        )}

        {openPeriodModal && <AddPeriod open={openPeriodModal} classRoom={ClassToAddPeriod} toggle={closePeriodModal} />} */}
      </Fragment>
    </>
  )
}

export default IncomeTable
