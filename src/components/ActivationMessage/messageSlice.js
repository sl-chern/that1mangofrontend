import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mes: null
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    changeMes: (state, action) => {
      state.mes = action.payload
    }
  }
})

export const {changeMes} = messageSlice.actions

export const selectMes = (state) => state.message.mes

export default messageSlice.reducer