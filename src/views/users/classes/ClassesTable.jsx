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

import CustomSpinner from 'src/@core/components/custom-spinner'

// ** Utils Import
import PageHeaderWithSearch from './ClassesPageHeader'
import { useClasses } from '../../../hooks/useClassess'
import { deleteClass, fetchClasses } from '../../../store/apps/classes/asyncthunk'
import ManageClass from './ManageClass'
import ViewClass from './ViewClass'
import ManageClassSubject from './ManageClassSubject'
import { fetchCurrentSession } from '../../../store/apps/currentSession/asyncthunk'
import { useCurrentSession } from '../../../hooks/useCurrentSession'
import UploadTimetable from './UploadTimetableModal'
import ViewClassTimeTable from './ViewClassTimetable'
import GetUserData from '../../../@core/utils/getUserData'

const userInfo = GetUserData()

const ClassesTable = () => {
  const dispatch = useAppDispatch()

  const [ClassesList, loading, paging] = useClasses()
  const [CurrentSessionData] = useCurrentSession()


  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [openViewDrawer, setViewDrawer] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState()
  const [ClassToUpdate, setClassToUpdate] = useState(null)
  const [ClassInView, setClassInView] = useState(null)
  const [key, setKey] = useState('')
  const [openAssignModal, setAssignModal] = useState(false)
  const [openUploadTimetableModal, setTimetableModal] = useState(false)
  const [openTimetableModal, setOpenTimeTable] = useState(false)
  const [ClassToAssign, setClassToAssign] = useState(null)
  const [ClassToViewTimeTable, setClassRoomToViewTimeTable] = useState(null)
  const [ClassToAddPeriod, setClassRoomToAddPeriod] = useState(null)
  const [assignSubject, setAssignSubject] = useState(false)
  const [anchorEl, setAnchorEl] = useState(Array(ClassesList?.length)?.fill(null))


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

  const toggleModal = () => {
    setShowModal(!showModal)
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

    handleRowOptionsClose(ClassesList?.indexOf(value))
    setClassToAssign(value)
  }

  const setClassToRemoveSubject = value => {
    setAssignSubject(false)
    toggleAssignModal()

    handleRowOptionsClose(ClassesList?.indexOf(value))
    setClassToAssign(value)
  }

  const setClassToAddPeriod = value => {
    setTimetableModal(true)

    handleRowOptionsClose(ClassesList?.indexOf(value))
    setClassRoomToAddPeriod(value)
  }

  const closePeriodModal = () => {
    setTimetableModal(false)
    setClassRoomToAddPeriod(null)
  }

  const setClassToViewTimeTable = value => {
    setOpenTimeTable(true)

    handleRowOptionsClose(ClassesList?.indexOf(value))
    setClassRoomToViewTimeTable(value)
  }

  const closeTimeTableModal = () => {
    setOpenTimeTable(!openTimetableModal)
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
    handleRowOptionsClose(ClassesList?.indexOf(value))
    OpenModal()
    setClassToUpdate(value)
  }

  const setClassToView = value => {
    handleRowOptionsClose(ClassesList?.indexOf(value))
    setViewDrawer(!openViewDrawer)
    setClassInView(value)
  }

  const closeViewModal = () => {
    setViewDrawer(!openViewDrawer)
    setClassInView(null)
  }

  const doDelete = value => {
    handleRowOptionsClose()
    setDeleteModal(true)
    setSelectedClass(value.id)
  }

  const doCancelDelete = () => {
    setDeleteModal(false)
    setSelectedClass(null)
  }

  const ondeleteClick = async () => {
    deleteClass(selectedClass).then(res => {
      if (res.status) {
        dispatch(fetchClasses({ page: 1, limit: 10, key }))
        doCancelDelete()
      }
    })
  }

  useEffect(() => {
    dispatch(fetchCurrentSession())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(fetchClasses({ page: page + 1, limit: 10, key }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, key])

  return (
    <>
      {/* <Stats data={ClassesList} statTitle='Classes'/> */}

      <PageHeaderWithSearch
        searchPlaceholder={'Search Class'}
        action='Add Class'
        toggle={toggleModal}
        handleFilter={setKey}
      />

      <Fragment>
        <TableContainer component={Paper} sx={{ maxHeight: 840 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell align='left' sx={{ minWidth: 200 }}>
                  Class
                </TableCell>
                {/* <TableCell align='center' sx={{ minWidth: 150 }}>
                Religion
              </TableCell> */}
                <TableCell align='center' sx={{ minWidth: 180 }}>
                  Type
                </TableCell>
                <TableCell align='center' sx={{ minWidth: 180 }}>
                  Capacity
                </TableCell>
                <TableCell align='center' sx={{ minWidth: 180 }}>
                  Class Category
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
                  {ClassesList?.length &&
                    ClassesList?.map((item, i) => {
                      return (
                        <TableRow hover role='checkbox' key={item.id}>
                          <TableCell align='left' sx={{ textTransform: 'uppercase' }}>
                            {`${item?.name} ${item.type}` || '--'}
                          </TableCell>

                       
                          <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                            {item?.type || '--'}
                          </TableCell>
                          <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                            {item?.capacity || '--'}
                          </TableCell>
                          <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                            {item?.category?.name?.toUpperCase() || '--'}
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
                                {(userInfo?.role?.name == 'super-admin' || userInfo?.role?.name == 'admin') && <MenuItem onClick={() => setClassToEdit(item, 'item')} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='tabler:edit' fontSize={20} />
                                  Edit Class
                                </MenuItem>}

                                <MenuItem onClick={() => setClassToView(item)} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='tabler:eye' fontSize={20} />
                                  View Class
                                </MenuItem>

                                {(userInfo?.role?.name == 'super-admin' || userInfo?.role?.name == 'admin') && <MenuItem onClick={() => doDelete(item)} sx={{ '& svg': { mr: 2 } }}>
                                  <Icon icon='tabler:trash' fontSize={20} />
                                  Delete Class
                                </MenuItem>}

                                {CurrentSessionData && (
                                  <MenuItem onClick={() => setClassToAddPeriod(item)} sx={{ '& svg': { mr: 2 } }}>
                                    <Icon icon='mdi:timetable' fontSize={20} />
                                    Upoad Timetable
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
                                </MenuItem>
                              </Menu>
                            </>
                          </TableCell>
                        </TableRow>
                      )
                    })}

                  {ClassesList?.length === 0 && (
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

        {showModal && <ManageClass open={showModal} toggle={OpenModal} classToEdit={ClassToUpdate} />}

        <DeleteDialog open={deleteModal} handleClose={doCancelDelete} handleDelete={ondeleteClick} />

        {openViewDrawer && <ViewClass open={openViewDrawer} closeCanvas={closeViewModal} classRoom={ClassInView} />}

        <ManageClassSubject
          open={openAssignModal}
          Classroom={ClassToAssign}
          status={assignSubject}
          toggle={toggleAssignModal}
        />

        {openTimetableModal && (
          <ViewClassTimeTable open={openTimetableModal} handleClose={closeTimeTableModal} selectedClass={ClassToViewTimeTable} />
        )}

        {openUploadTimetableModal && <UploadTimetable open={openUploadTimetableModal} selectedClass={ClassToAddPeriod} toggle={closePeriodModal} />}
      </Fragment>
    </>
  )
}

export default ClassesTable
