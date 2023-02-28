import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false
}

export const titleSlice = createSlice({
  name: 'title',
  initialState,
  reducers: {
    changeTitleLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const {changeTitleLoading} = titleSlice.actions

export const selectTitleLoading = (state) => state.title.loading

export default titleSlice.reducer