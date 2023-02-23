import React from 'react';
import axios from 'axios';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Options from './Options.js';
import NetInfo from "@react-native-community/netinfo";
import { io } from 'socket.io-client';
import ShareMenu, { ShareMenuReactView } from "react-native-share-menu";
import styles from '.././styles/App.scss';
import {
	KeyboardAvoidingView,
	View,
	Text,
	ScrollView,
	Keyboard,
	Alert
} from 'react-native';
import {
	ActivityIndicator,
	TextInput,
	Button,
	Card,
	Snackbar,
	SegmentedButtons
} from 'react-native-paper';
import { 
	useSelector,
	useDispatch 
} from 'react-redux';

import { 
	setFormats,
	setURL
} from './../reducers/rootReducer.js';

const API="http://ytdr.us-east-1.elasticbeanstalk.com";

const socket=io(API,{
	transports:['websocket']
})

socket.on("connect",()=>console.log("client side connected"))


const Search=()=>{

	const [progress,setProgress]=React.useState('')
	const [result,setResult]=React.useState(0)
	const [btn,setBtn]=React.useState('video')
	const [isDownloadStart,setIsDownloadStart]=React.useState(false)
	const [isDownloadComplete,setIsDownloadComplete]=React.useState(false)
	const [yturl,setYTUrl]=React.useState('')
	const [isLoading,setIsLoading]=React.useState(false)
	const formats=useSelector((state)=>state.formats)
	const IPref=React.useRef('')
	const dispatch=useDispatch()

	React.useEffect(()=>{

		const unsubscribe = NetInfo.addEventListener(state => {
			if(state.type.includes("cellular"))
  				Alert.alert("Info",`You're currently on ${state.type.toUpperCase()} data 
					Please use Wi-Fi for faster downlaods`,
			[{text:"Ok"}],{cancelable:true})
		})
	},[])
	
	const handleShare=(item)=>{
		if(item && item.mimeType=="text/plain")
			setYTUrl(item.data)
		console.log(yturl)}


	React.useEffect(() => {
    		ShareMenu.getInitialShare(handleShare);
	}, []);

	React.useEffect(() => {
		const listener = ShareMenu.addNewShareListener(handleShare);

    		return () => {
      			listener.remove();
    		};
  	}, []);



	socket.on("data",(data)=>setProgress(data+" MB Downloaded")
	)

	//Loads the list of urls
	const getVdoInfo=async(yturl)=>{
		IPref.current.blur()			//This dismiss the Keyboard automatically!
		setIsLoading(true)
		console.log("Fetching info")
		dispatch(setURL(yturl))
		if(!yturl || yturl.replace(/\s/g,'').length==0){
			Alert.alert("Error","Invalid URL Specified!",[{text:"OK"}],{cancelable:true})
			setIsLoading(false)
			return}

		await axios.post(`${API}/getinfo`,{yturl:yturl})
		.then((res)=>{
			setIsLoading(false)
			dispatch(setFormats(res.data))},
		      (err)=>console.log(err))
		console.log(IPref)
	}
	
	//Downloads the media file from server
	const download=async (title,id,type,format)=>{
		
		const dirs= ReactNativeBlobUtil.fs.dirs
		await ReactNativeBlobUtil.config({
			fileCache:true
        	         })
        	      .fetch('POST', `${API}/download`,{
			    'Content-Type': 'application/json'},JSON.stringify({
										id:id,
			    							type:type}))
        	      .then(async(res) => {
				
			      
				await ReactNativeBlobUtil.MediaCollection.copyToMediaStore({
                        		name: `${title}${format}`, // Dynamic name of the file			
                        		parentFolder: '', // subdirectory in the Media Store	
                        		mimeType: type.includes('audio')? //Dynamic mime
						'audio/mpeg':
						'video/mp4' 
                    			},
                    			'Download',  
                    			res.path() 
            				);

            			console.log('The file saved to ', res.path())
			      	setIsDownloadComplete(true)
			        setProgress('')
        			})
       }

	//Shows the progress of download in server and the encoding of A&V if Video
	const downloadProgress=async(itag,title,format)=>{
		
		if(!yturl){
			Alert.alert("URL is empty or has been modified!\n Please paste the link")
			return}

		let dirs = ReactNativeBlobUtil.fs.dirs
		let type=format.substr(0,format.indexOf('/'))
		format='.'+format.substr(format.indexOf('/')+1)

		const id=String((Math.random()*10000).toFixed(0))+format

		setIsDownloadStart(true)

		let bodydata={
			itag:itag,
			ref:yturl,
			type:type,
			id}
		
		await axios.post(`${API}/getA&V`,bodydata)
		      .then((res)=>{
			      console.log(res.data)
			      setResult(res.data)
			      if(res.status>=200 && res.status <300)
			          download(title,id,type,format)
			      else 
			          console.log("Failed")},
			    (err)=>console.log(err)
		      )
	}
	
	return(
		<KeyboardAvoidingView
		enabled={false}
		behaviour={"height"}
		style={styles.container}>
		   <View style={styles.searchArea}>
		      <TextInput
		       value={yturl}
		       ref={IPref}
		       onChangeText={(ch)=>setYTUrl(ch)}
		       style={styles.searchBox}
		       placeholder={"Enter url"}/>
		      <Button onPress={()=>getVdoInfo(yturl)}>
		          <Text style={styles.submitBtn}>{"Get formats"}</Text>
		      </Button>
		      <Text style={styles.downloadText}>{`${progress}`}</Text>
		   </View>
		   <View style={styles.options}>
		      { 
			isLoading?
			      <ActivityIndicator style={{margin:'auto'}}/>:
			      <Options
			      btn={btn}
			      download={download} 
			      downloadProgress={downloadProgress}/>
		      }
		   </View>
		   <SegmentedButtons
		   style={styles.segmentedBtns}
		   value={""}
		   onValueChange={()=>null}
		   density={'regular'}
		   buttons={[
			     {
			      value:'Audio',
			      label:'Audio',
			      disabled:false,
			      onPress:(e)=>{setBtn("audio")},
			      style:btn=="audio"?styles.selectedBtn:null
			     },
			     {
			      value:'Video',
			      label:'Video',
			      onPress:(e)=>{setBtn("video")},
			      style:btn=="video"?styles.selectedBtn:null
			     },
		   ]}/>
			    
		   <Snackbar
		   visible={isDownloadStart}
		   duration={500}
		   onDismiss={()=>setIsDownloadStart(false)}>
		      {"Starting Download"}
		   </Snackbar>
		   <Snackbar
		   visible={isDownloadComplete}
		   duration={1200}
		   onDismiss={()=>setIsDownloadComplete(false)}>
		      {"Download completed! Check your downloads folder"}
		  </Snackbar>
		</KeyboardAvoidingView>
	)
}

export default Search;
