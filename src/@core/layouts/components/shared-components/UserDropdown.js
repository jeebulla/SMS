// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
//import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const UserDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const [userType, setUser] = useState({})

  // ** Hooks
  const router = useRouter()

  // const { logout } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleResetPassword = () => {
    
      router.push('/reset-password')
    
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem',
      color: 'text.secondary'
    }
  }

  const handleLogout = () => {
    const logoutRoute = (userType?.role?.name == 'student' || userType?.role?.name == 'parent') ? '/userlogin' :  userType?.role?.name == 'others' ?  '/applicantlogin' : '/login'
    window.localStorage.removeItem('authToken')
    handleDropdownClose(logoutRoute)
  }



  useEffect(() => {
    const userType = JSON.parse(window.localStorage.getItem('authUser'))
    setUser(userType)
  }, [])

  const backEndURL = process.env.NEXT_PUBLIC_BACKEND_URL

  const { role, firstName, lastName } = userType

  const renderClient = row => {
    const initials = `${row.firstName} ${row.lastName}`
    if (row?.profilePicture !== null && row?.profilePicture?.length) {
      return (
        <CustomAvatar
          src={`${backEndURL?.replace('api', '')}/${row?.profilePicture}`}
          sx={{ mr: 2.5, width: 32, height: 32 }}
        />
      )
    } else {
      return (
        <CustomAvatar
          skin='light'
          color='info'
          sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
        >
          {getInitials(initials || 'John Doe')}
        </CustomAvatar>
      )
    }
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        {renderClient(userType)}
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              {renderClient(userType)}
            </Badge>
            <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500 }}>{`${firstName} ${lastName}`}</Typography>
              <Typography variant='body2'>{role?.name == "others"  ? 'Applicant': role?.name }</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon='tabler:logout' />
            Sign Out
          </Box>
       
        </MenuItemStyled>
        {userType?.role?.name !== 'others' && <MenuItemStyled sx={{ p: 0 }} onClick={handleResetPassword}>
          <Box sx={styles}>
            <Icon icon='mdi:key-change' />
            Reset Password
          </Box>
        </MenuItemStyled> }
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
