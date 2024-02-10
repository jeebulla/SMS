import axios from 'axios'
import { notifySuccess } from '../../../@core/components/toasts/notifySuccess'
import { notifyError } from '../../../@core/components/toasts/notifyError'
import { createAsyncThunk } from '@reduxjs/toolkit'



export const fetchIncome = createAsyncThunk('/ncome/FetchIncome', async (query) => {
    try {
      const response = await axios.get(`/accounts?page=${query.page}&limit=10&key=${query.key}&type=income`)


      return response
    } catch (error) {

    //   notifyError('Error fetching Guardian')
  
    }
  })


 export const createIncome = async (vals)=> {
    try {
      const res = await axios.post(`/accounts`, vals) 


      return res
    } catch (error) {
      notifyError('Failed to create income')
    }
  }

  export const updateIncome = async (vals, id)=> {
    try {
      const res = await axios.patch(`/accounts/updateincomeandexpenditure/${id}`, vals) 


      return res
    } catch (error) {
      notifyError('Failed to update income')
    }
  }

  export const processIncome = async (vals)=> {
    try {
      const res = await axios.post(`/accounts/process`, vals) 

      if(res.data.success){
        notifySuccess("Income Updated")
      }


      return res
    } catch (error) {
      notifyError('Failed to update income')
    }
  }

