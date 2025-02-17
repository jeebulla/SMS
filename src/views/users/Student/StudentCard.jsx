// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import { useAppDispatch } from 'src/hooks'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'

// ** Utils Import
import {  formatFirstLetter } from '../../../@core/utils/format'
import { formatDateToReadableFormat } from '../../../@core/utils/format'
import StaffDetailCard from '../component/StaffDetailCard'
import { getInitials } from 'src/@core/utils/get-initials'
import { Stack } from '@mui/material'
import { calculateAge } from '../../../@core/utils/calculateAge'
import { useClasses } from '../../../hooks/useClassess'
import { getStudentByIdentification } from '../../../store/apps/Student/asyncthunk'
import { useRooms } from '../../../hooks/useRooms'
import { fetchRooms } from '../../../store/apps/rooms/asyncthunk'

const roleColors = {
  superadmin: 'error',
  Student: 'info',

  maintainer: 'success',
  subscriber: 'primary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: 0,
  left: -10,
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')(({ theme }) => ({
  alignSelf: 'flex-end',
  color: theme.palette.text.disabled,
  fontSize: theme.typography.body1.fontSize
}))

const StudentCard = ({ Student }) => {
  // ** States
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [initials, setInitials] = useState('')
  const [studentClass, setStudentClass] = useState({})
  const [studentRoom, setStudentRoom] = useState({})
  const [activeStudent, setActiveStudent] = useState({})
  


  const [ClassesList] = useClasses()
  const [RoomsList] = useRooms()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchRooms({ page: 1, limit: 200, key: '' }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    if(Student.roomId !== null && RoomsList?.length > 0){
      const room = RoomsList.find((room)=> room.id == Student.roomId)
      setStudentRoom({...room})
    }
  },[Student, RoomsList])

 useEffect(()=>{
  let isMounted = true;

  if(ClassesList.length > 1 && Student){

    const classInfo =  ClassesList.find((c)=> c.id === Student.classId)
    if(isMounted){
      setStudentClass({...classInfo})
    }
  }

   // Cleanup function

   return () => {
    isMounted = false;
    setStudentClass({});
};

  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[ClassesList,Student])



 useEffect(() => {
  let isMounted = true;

  if (Student) {
      setInitials(`${Student.firstName} ${Student.lastName}`);

      getStudentByIdentification(Student?.identificationNumber).then((res) => {
          if (isMounted) {
              setActiveStudent({...res.data.data});
          }
      });
  }

  // Cleanup function
  return () => {
      isMounted = false;
      setActiveStudent({});
  };
}, [Student]);

  useEffect(() => {
    if (Student) {
      setProfilePictureUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL.replace('api', '')}/${Student?.profilePicture}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Student])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Fragment>
          <CardContent sx={{ pb: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Box sx={{ pt: 1.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {Student?.profilePicture ? (
                <CustomAvatar
                  src={profilePictureUrl}
                  variant='rounded'
                  alt={`${formatFirstLetter(Student?.firstname)} ${formatFirstLetter(Student?.lastname)}`}
                  sx={{ width: 150, height: 150, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  color='info'
                  sx={{
                    mr: 2.5,
                    width: 50,
                    height: 50,
                    fontWeight: 500,
                    fontSize: theme => theme.typography.body1.fontSize
                  }}
                >
                  {getInitials(initials || 'John Doe')}
                </CustomAvatar>
              )}

              {/* 
              <Typography variant='h5' sx={{ mb: 3 }}>
                {formatFirstLetter(Student?.firstName) || '--'}
              </Typography> */}

              <CustomChip
                rounded
                skin='light'
                size='small'
                label={Student?.boarder ? `Boarding Student` : 'Day Student'}
                color='info'
                sx={{ textTransform: 'capitalize' }}
              />
             
            </Box>
            <Box sx={{ display: 'flex', position: 'relative' }}>
              <Typography variant='h5' sx={{ mt: -1, mb: -1.2,  fontSize: '2rem !important' }}>
                {`${studentClass?.name} ${studentClass?.type}`}
                <Sub>/ Class</Sub>
              </Typography>
            </Box>
          </CardContent>

          <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Student?.roomId !== null && 
              <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                <CustomAvatar skin='light' color='error' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                  <Icon fontSize='1.75rem' icon='guidance:hotel-room' />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Room Name</Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    {studentRoom?.name}
                  </Typography>
                </div>
              </Box>
              }

{(Student?.roomId == null && Student.boarder) && 
              <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                <CustomAvatar skin='light' color='error' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                  <Icon fontSize='1.75rem' icon='guidance:hotel-room' />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>No Room Assigned</Typography>
                 
                </div>
              </Box>
              }

              <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                  <Icon fontSize='1.75rem' icon='fluent-mdl2:date-time-2' />
                </CustomAvatar>
                <div>
                  <Typography variant='body2'>Date of Registration</Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    {formatDateToReadableFormat(Student?.registrationDate) || 'No available date'}
                  </Typography>
                </div>
              </Box>
            

             
            </Box>
          </CardContent>

          <Divider sx={{ my: '0 !important', mx: 6 }} />

          <CardContent sx={{ pb: 4 }}>
            <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              Personal Information
            </Typography>

            <Box sx={{ pt: 4 }}>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <StaffDetailCard
                    iconName='solar:user-broken'
                    cardTitle='Name'
                    value={`${formatFirstLetter(Student?.firstName)} ${formatFirstLetter(Student?.lastName)}` || '--'}
                  />
                </Grid>

                <Grid item xs={6}>
                  <StaffDetailCard
                    iconName='fluent-mdl2:date-time-2'
                    cardTitle='Date of Birth'
                    value={formatDateToReadableFormat(Student?.dateOfBirth) || '--'}
                  />
                </Grid>

                <Grid item xs={6}>
                  <StaffDetailCard
                    iconName='ion:image-sharp'
                    cardTitle='Age'
                    value={calculateAge(Student?.dateOfBirth) || '--'}
                  />
                </Grid>

                <Grid item xs={6}>
                  <StaffDetailCard iconName='fontisto:email' cardTitle='Email' value={Student?.email || '--'} />
                </Grid>

                <Grid item xs={6}>
                  <StaffDetailCard iconName='bi:phone' cardTitle='Phone Number' value={Student?.phone || '--'} />
                </Grid>

                <Grid item xs={6}>
                  <StaffDetailCard iconName='icons8:gender' cardTitle='Gender' value={Student?.gender || '--'} />
                </Grid>

                <Grid item xs={6}>
                  <StaffDetailCard iconName='fa-solid:pray' cardTitle='Religion' value={Student?.religion || '--'} />
                </Grid>

                <Grid item xs={6}>
                  <StaffDetailCard
                    iconName='material-symbols:background-replace'
                    cardTitle='Tribe'
                    value={Student?.ethnicity || '--'}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StaffDetailCard
                    iconName='tabler:user-pin'
                    cardTitle='Address'
                    value={Student?.residentialAddress || '--'}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>

          <Divider sx={{ my: '0 !important', mx: 6 }} />

          <CardContent sx={{ pb: 4 }}>
            {Student?.parents?.length > 0 ? (
              Student.parents.map((item, i) => {

                let position;
                switch (i) {
                  case 0:
                    position = '1st';
                    break;
                  case 1:
                    position = '2nd';
                    break;
                  case 2:
                    position = '3rd';
                    break;
                  default:
                    position = `${i + 1}th`;
                }

                return (
                  <Box key={i} sx={{pt: 8}}>
                    <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                      {position} Guardian Information
                    </Typography>
                    <Box sx={{ pt: 4 }}>
                      <Grid container spacing={5} >
                        <Grid item xs={6}>
                          <StaffDetailCard
                            iconName='solar:user-broken'
                            cardTitle='Name'
                            value={`${formatFirstLetter(item?.firstName)} ${formatFirstLetter(item?.lastName)}` || '--'}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <StaffDetailCard iconName='icons8:gender' cardTitle='Gender' value={item?.gender || '--'} />
                        </Grid>

                        <Grid item xs={6}>
                          <StaffDetailCard iconName='bi:phone' cardTitle='Phone Number' value={item?.phone || '--'} />
                        </Grid>

                        <Grid item xs={6}>
                          <StaffDetailCard iconName='fontisto:email' cardTitle='Email' value={item?.email || '--'} />
                        </Grid>

                        <Grid item xs={12}>
                          <StaffDetailCard
                            iconName='tabler:user-pin'
                            cardTitle='Address'
                            value={item?.residentialAddress || '--'}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )
              })
            ) : (
              <Typography variant='body2' sx={{ color: 'white', textTransform: 'capitalize' }}>
                No Guardian Available
              </Typography>
            )}
          </CardContent>

          <Divider sx={{ my: '0 !important', mx: 6 }} />

          <CardContent sx={{ pb: 4 }}>
            <Typography variant='body2' sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
              Subjects
            </Typography>

            {activeStudent?.subjects?.length > 0 ? 
            activeStudent?.subjects?.map((subject, i)=>(
              <Box sx={{ pt: 4 }} key={subject.id}>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <StaffDetailCard
                    iconName='mdi:learn-outline'
                    cardTitle={`${i+1}.`}
                    value={subject?.name}
                  />
                </Grid>
                </Grid>
                </Box>
            ))
            : 
            <Typography variant='body1' sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '14px' }}>No Registered Subject</Typography>
            }

          </CardContent>
        </Fragment>
      </Grid>
    </Grid>
  )
}

export default StudentCard
