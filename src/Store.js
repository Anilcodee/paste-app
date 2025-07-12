import { configureStore } from '@reduxjs/toolkit'
import pasteReducer from './redux/pasteSlice'

export const Store = configureStore({
  reducer: {
    paste: pasteReducer,
  },
})