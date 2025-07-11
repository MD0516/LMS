import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './LoginSlice/LoginSlice'

export const store = configureStore({
    devTools: false,
    reducer: {
        login: loginSlice,
    }
})