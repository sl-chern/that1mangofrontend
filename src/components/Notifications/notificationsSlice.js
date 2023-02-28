import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: []
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    changeNotifications: (state, action) => {
      state.notifications = [action.payload].concat([...state.notifications])
    },
    deleteNotifications:(state, action) => {
      state.notifications = [...action.payload]
    }
  }
})

export const {changeNotifications, deleteNotifications} = notificationsSlice.actions

export const selectNotifications = (state) => state.notifications.notifications

export default notificationsSlice.reducer