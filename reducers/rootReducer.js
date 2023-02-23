import React from 'react';
import { createSlice } from '@reduxjs/toolkit';

const rootReducer=createSlice({
	name:'rootReducer',
	initialState:{
		yturl:'',
		formats:[]
	},
	reducers:{
		setURL(state,action){
			const { yturl }=action.payload
			console.log("Check @ Rootreducer",action.payload)
			state.ytuel=yturl
		},
		setFormats(state,action){
			state.formats=action.payload}
	}
})



console.log(rootReducer)
export const { setURL,setFormats }=rootReducer.actions
export default rootReducer.reducer
