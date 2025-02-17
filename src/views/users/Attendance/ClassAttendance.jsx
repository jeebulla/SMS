import React, { useEffect, useState, Fragment } from 'react'

import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import IconButton from '@mui/material/IconButton'

import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomChip from 'src/@core/components/mui/chip'

// ** Third Party Imports
import * as yup from 'yup'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useAppDispatch } from '../../../hooks'
import NoData from '../../../@core/components/emptyData/NoData'
import CustomSpinner from '../../../@core/components/custom-spinner'
import { formatDate, formatDateToYYYMMDDD, } from '../../../@core/utils/format'
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, Tooltip } from '@mui/material'
import { fetchStaffs } from '../../../store/apps/staff/asyncthunk'
import { fetchSubjects } from '../../../store/apps/subjects/asyncthunk'
import { useClasses } from '../../../hooks/useClassess'
import { useSession } from '../../../hooks/useSession'
import { fetchSession } from '../../../store/apps/session/asyncthunk'
import { useStudent } from '../../../hooks/useStudent'

import { CustomInput } from './EditAttendance'
import { fetchClassAttendance } from '../../../store/apps/attendance/asyncthunk'
import { useAttendance } from '../../../hooks/useAttendance'
import EditAttendance from './EditAttendance'
import { fetchClasses } from '../../../store/apps/classes/asyncthunk'
import { fetchStudents } from '../../../store/apps/Student/asyncthunk'
import { truncateText } from '../../../@core/utils/truncateText'

const defaultValues = {
  date: ''
}

const schema = yup.object().shape({
  date: yup.string().required('Date is required')
})

const ClassAttendanceTable = () => {
  // Hooks
  const dispatch = useAppDispatch()
  const [ClassesList] = useClasses()
  const [SessionData] = useSession()
  const [StudentData] = useStudent()
  const [loading] = useAttendance()

  // States

  const [classId, setClassId] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [date, setDate] = useState('')
  const [readableDate, setReadableDate] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [classAttendance, setClassAttendance] = useState([])
  const [openEditDrawer, setEditDrawer] = useState(false)
  const [attendanceToUpdate, setAttendanceToUpdate] = useState(null)
  const [activeStudent, setActiveStudent] = useState('')

  const handleChangeClass = e => {
    Number(setClassId(e.target.value))
  }

  const toggleModal = () => {
    closeEditModal()
  }

  const closeEditModal = () => {
    setEditDrawer(!openEditDrawer)
    setAttendanceToUpdate(null)
  }

  const setAttendanceToEdit = value => {
    const Student = StudentData?.result?.find(student => student.id == value.studentId)
    const studentName = `${Student.firstName} ${Student.lastName}`
    setActiveStudent(studentName)
    setEditDrawer(!openEditDrawer)
    setAttendanceToUpdate(value)
  }



  const handleChangeSession = e => {
    Number(setSessionId(e.target.value))
  }

  const displayAttendance = async data => {
    const date = formatDateToYYYMMDDD(data.date)
    const readableDate = formatDate(data.date)
    setDate(date)
    setReadableDate(readableDate)
    const res = await dispatch(fetchClassAttendance({ classId, sessionId, date }))

    if(res.payload.data.data.length > 0){
      setClassAttendance(res?.payload?.data?.data)
    }
    else {
      setClassAttendance([])
    }
  }

  const updateFetch = () => {
    dispatch(fetchClassAttendance({ classId, sessionId, date }))
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })


  useEffect(() => {
    dispatch(fetchStaffs({ page: 1, limit: 300, key: 'teacher' }))
    dispatch(fetchSubjects({ page: 1, limit: 300, categoryId: '' }))
    dispatch(fetchClasses({ page: 1, limit: 300, key: '' }))
    dispatch(fetchSession({ page: 1, limit: 300 }))
    dispatch(fetchStudents({ page: 1, limit: 3000, key: '' }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Card>
        <CardHeader title='Filter' />
        <CardContent>
          <form onSubmit={handleSubmit(displayAttendance)}>
            <Grid container spacing={12}>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  select
                  fullWidth
                  label='Class*'
                  SelectProps={{ value: classId, onChange: e => handleChangeClass(e) }}
                >
                  {/* <MenuItem value=''>{ staffId ? `All Staff` : `Select Staff`}</MenuItem> */}
                  {ClassesList?.map(item => (
                    <MenuItem key={item?.id} value={item?.id} sx={{ textTransform: 'uppercase' }}>
                      {`${item?.name} ${item.type}`}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={3}>
                <CustomTextField
                  select
                  fullWidth
                  label='Session*'
                  SelectProps={{ value: sessionId, onChange: e => handleChangeSession(e) }}
                >
                  {/* <MenuItem value=''>{ staffId ? `All Staff` : `Select Staff`}</MenuItem> */}
                  {SessionData?.map(item => (
                    <MenuItem key={item?.id} value={item?.id} sx={{ textTransform: 'uppercase' }}>
                      {`${item?.name} ${item.term}`}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Controller
                  name='date'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value}
                      showYearDropdown
                      showMonthDropdown
                      popperPlacement='bottom-end'
                      maxDate={new Date()}
                      onChange={e => {
                        onChange(e)
                        setSelectedDate(e)
                      }}
                      placeholderText='MM/YYYY'
                      customInput={
                        <CustomInput
                          value={value}
                          onChange={onChange}
                          autoComplete='off'
                          label='Date*'
                          error={Boolean(errors.date)}
                          {...(errors.date && { helperText: errors.date.message })}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isSubmitting || !classId || !sessionId || selectedDate?.length < 1}
                  sx={{ '& svg': { mr: 2 }, backgroundColor: 'info.main' }}
                >
                  <Icon fontSize='1.125rem' icon='tabler:keyboard-show' />
                  Display Attendance
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ maxHeight: 840, mt: 15 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ minWidth: 70 }}>
                S/N
              </TableCell>
              <TableCell align='left' sx={{ minWidth: 200 }}>
                STUDENT
              </TableCell>
              <TableCell align='center' sx={{ minWidth: 100 }}>
                CHECK IN TIME
              </TableCell>
              <TableCell align='center' sx={{ minWidth: 100 }}>
                STATUS
              </TableCell>
             
              <TableCell align='center' sx={{ minWidth: 200 }}>
                REASON FOR ABSENCE
              </TableCell>
              <TableCell align='center' sx={{ minWidth: 100 }}>
                DATE
              </TableCell>
              <TableCell align='left' sx={{ minWidth: 50 }}>
                ACTIONS
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
                {classAttendance?.map((item, i) => {
                  const Student = StudentData?.result?.find(student => student.id == item.studentId)

                  return (
                    <TableRow hover role='checkbox' key={item?.id}>
                      <TableCell align='left'>{i + 1}</TableCell>
                      <TableCell
                        align='left'
                        sx={{ textTransform: 'uppercase' }}
                      >{`${truncateText(Student.firstName)} ${truncateText(Student.lastName)}`}</TableCell>
                      <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                        {item.checkInTime?.slice(0, 5)}
                      </TableCell>
                      <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                        {item.attendanceStatus ? (
                          <CustomChip
                            rounded
                            skin='light'
                            size='small'
                            label={'Present'}
                            color='success'
                            sx={{ textTransform: 'capitalize' }}
                          />
                        ) : (
                          <CustomChip
                            rounded
                            skin='light'
                            size='small'
                            label={'Absent'}
                            color='error'
                            sx={{ textTransform: 'capitalize' }}
                          />
                        )}
                      </TableCell>
                      <TableCell align='center' sx={{ textTransform: 'uppercase' }}>{`${
                        item?.reasonForAbsence ? item?.reasonForAbsence : '--'
                      }`}</TableCell>
                      <TableCell align='center' sx={{ textTransform: 'uppercase' }}>
                        {readableDate}
                        </TableCell>
                      <TableCell title='Edit Attendance Record'>
                        <IconButton size='small' onClick={() => setAttendanceToEdit(item)}>
                          <Icon icon='tabler:edit' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}

                {classAttendance?.length === 0 && (
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

      {openEditDrawer && 
      <EditAttendance
        open={openEditDrawer}
        closeModal={toggleModal}
        selectedRecord={attendanceToUpdate}
        fetchData={updateFetch}
        studentName={activeStudent}
      />
    }

    </div>
  )
}

export default ClassAttendanceTable
