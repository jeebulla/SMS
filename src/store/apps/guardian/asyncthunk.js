import axios from 'axios'
import { notifySuccess } from '../../../@core/components/toasts/notifySuccess'
import { notifyError } from '../../../@core/components/toasts/notifyError'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const createGuardian =  async vals => {
  try {
    const response = await axios.post('/auth/register/user?role=parent', vals)
    notifySuccess('Guardian Added')

    return response
  } catch (error) {
    notifyError('Unable to create Guardian')

   
  }
}

export const fetchGuardian = createAsyncThunk('/Guardian/FetchGuardian', async (query) => {
    try {
      const response = await axios.get(`/parents?page=${query.page}&limit=10&key=${query.key}`)

  
      return response
    } catch (error) {
      console.log(error, 'error')
  
    }
  })



  export const searchParent = async (key)=> {
    try {
      const response = await axios.get(`/parents?page=1&limit=2000&key=${key}&type=parent`)
  
      return response?.data.data.result
    } catch (error) {
      
    }
  }

  export const deleteGuardian =  async (id) => {
    try {
      const response = await axios.delete(`/parents/delete?id=${id}`)
  
      if (response.data.success) {
        notifySuccess('Guardian Deleted')
      }
  
      return response
    } catch (error) {
      notifyError('Unable to Delete Guardian')
  
    }
  }

  export const updateGuardian = async (payload, id)=> {
    try {
      const response = await axios.patch(`/parents/update?id=${id}`, payload)
  
      if (response.data.success){
        notifySuccess('Guardian Updated')
      }
  
      return response
    } catch (error) {
      notifyError('Unable to update guardian')
      
    }
  }