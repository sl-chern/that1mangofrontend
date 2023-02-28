import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  login: "",
  email: "",
  age: 0,
  isStaff: false,
  id: -1,
  user: null,
  pict: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    change: (state, action) => {
      state.login = action.payload
    },
    changeEmail: (state, action) => {
      state.email = action.payload
    },
    changeId: (state, action) => {
      state.id = action.payload
    },
    changeUser: (state, action) => {
      state.user = action.payload
    },
    changeIsStaff: (state, action) => {
      state.isStaff = action.payload
    },
    changePict: (state, action) => {
      state.pict = action.payload
    },
    changeAge: (state, action) => {
      state.age = action.payload
    },
  }
})

export const {change, changeEmail, changeId, changeUser, changeIsStaff, changePict, changeAge} = userSlice.actions

export const selectLogin = (state) => state.user.login
export const selectEmail = (state) => state.user.email
export const selectId = (state) => state.user.id
export const selectUser = (state) => state.user.user
export const selectIsStaff = (state) => state.user.isStaff
export const selectPict = (state) => state.user.pict
export const selectAge = (state) => state.user.age

export default userSlice.reducer