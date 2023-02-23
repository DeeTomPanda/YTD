import React from 'react';
import styles from '.././styles/App.scss';
import {
	KeyboardAvoidingView,
	View,
	Text,
	ScrollView,
	Alert
} from 'react-native';
import {
	ActivityIndicator,
	TextInput,
	Button,
	Card,
} from 'react-native-paper';
import {
	useSelector,
	useDispatch
} from 'react-redux';


const Options=({btn,downloadProgress,download})=>{
	
	const formats=useSelector((state)=>state.formats)
	const audio=formats.filter((v)=>{
		if(v.quality.includes("AUDIO"))
			return v})
	const video=formats.filter((v)=>{
		if(v.quality.includes("p"))
			return v})
	const showFormats= btn=="audio"
			   ? audio
			   : btn=="video"
		             ? video
	                     : null
	if(!showFormats)
		return(Alert.alert("FATAL ERROR","Invalid formats found!",
			[{text:"OK"}],{cancelable:true}))

	return(
		<ScrollView
		keyboardShouldPersistTaps={'always'}>
		   <View style={styles.scrollViewInner}>
	   	{
	   	   showFormats.map((v,i)=>{
			return(
				<Card 
				key={i}
				contentStyle={styles.optionsCard}>
			   	   <Card.Content>
			      	      <Text 
				      style={styles.optionstext}>
				         {`Format: ${v.mime}`}
				      </Text> 
                                      <Text 
				      style={styles.optionstext}>
				         {`Quality: ${v.quality}`}
				      </Text>
			  	   </Card.Content>
				   <Card.Actions>
				      <Button 
				      onPress={()=>downloadProgress(v.itag,v.title,v.mime)}
				      mode={'text'}>
				         {"DOWNLOAD"}
				      </Button>
				   </Card.Actions>
				</Card>)
	           })
		}
		   </View>
		</ScrollView>
	)
}

export default Options
