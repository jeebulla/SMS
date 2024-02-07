import axios from 'axios'
import { notifySuccess } from '../../../@core/components/toasts/notifySuccess'
import { notifyError } from '../../../@core/components/toasts/notifyError'
import { createAsyncThunk } from '@reduxjs/toolkit'


export const createStudent =  async vals => {
  try {
    const response = await axios.post('/auth/register/user?role=student', vals)
    notifySuccess('Student Added')

    return response
  } catch (error) {
    notifyError('Error Creating Guardian')

   
  }
}

export const fetchStudents = createAsyncThunk('/Students/FetchStudents', async (query) => {
  try {
    const response = await axios.get(`/users?page=${query.page}&limit=10&key=${query.key}&type=student`)


    return response
  } catch (error) {
    notifyError('Error fetching Students')

  }
})

export const searchStudent = async (key)=> {
  try {
    const response = await axios.get(`/users?page=1&limit=20&key=${key}&type=student`)

    return response?.data.data.result
  } catch (error) {
    
  }
}

