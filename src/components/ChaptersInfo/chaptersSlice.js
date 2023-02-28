import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: [],
  deleted: [],
  uploading: false
}

export const chaptersSlice = createSlice({
  name: 'chapters',
  initialState,
  reducers: {
    changeLoading: (state, action) => {
      state.loading = action.payload
    },
    changeDeleted: (state, action) => {
      state.deleted = action.payload
    },
    changeUploading: (state, action) => {
      state.uploading = action.payload
    },
  }
})

export const {changeLoading, changeDeleted, changeUploading} = chaptersSlice.actions

export const selectLoading = (state) => state.chapters.loading
export const selectDeleted = (state) => state.chapters.deleted
export const selectUploading = (state) => state.chapters.uploading

export default chaptersSlice.reducer