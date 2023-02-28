import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../components/Login/loginSlice'
import messageReducer from '../components/ActivationMessage/messageSlice'
import themeReducer from '../components/Header/themeSlice'
import notificationsReducer from '../components/Notifications/notificationsSlice'
import userNotificationsReducer from '../components/Authorization/userNotificationsSlice'
import chaptersReducer from '../components/ChaptersInfo/chaptersSlice'
import titleReducer from '../components/Title/titleSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    theme: themeReducer,
    notifications: notificationsReducer,
    userNotifications: userNotificationsReducer,
    chapters: chaptersReducer,
    title: titleReducer,
  },
});
