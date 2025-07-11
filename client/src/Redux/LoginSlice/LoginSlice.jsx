import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
    name: 'admin',
    initialState: true,
    reducers: {
        loginValue: (state, action) => {
            return true
        },
        loginFalse: (state, action) => {
            return false
        }
    }
})

export const { loginValue, loginFalse } = loginSlice.actions;
export default loginSlice.reducer