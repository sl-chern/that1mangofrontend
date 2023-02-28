import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: null
}

export const userNotificationsSlice = createSlice({
  name: 'userNotifications',
  initialState,
  reducers: {
    changeCount: (state, action) => {
      state.count = action.payload
    }
  }
})

export const {changeCount} = userNotificationsSlice.actions

export const selectCount = (state) => state.userNotifications.count

export default userNotificationsSlice.reducer