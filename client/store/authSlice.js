import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
}


const authSclice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state, action) => {
            localStorage.removeItem('userInfo');
            console.log(localStorage.getItem('userInfo'));
            state.userInfo = null;
        },
    }
})

export const { setCredentials, logout } = authSclice.actions;

export default authSclice.reducer;