import React from 'react';
import {
	KeyboardAvoidingView,
	View,
	Text,
	PermissionsAndroid
} from 'react-native';
import Search from './screens/Search.js';

const App=()=>{
	
	React.useEffect(()=>{
		const req=async()=>{
			const granted=await PermissionsAndroid
				.requestMultiple([
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
					PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE])
			if(granted)
				console.log("Granted")
		}
		req()
	},[])

	return(
		<Search/>)
}

export default App
