import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Platform, View
  , TouchableOpacity, Image,Text,
  I18nManager,
  //  useWindowDimensions  
  } from 'react-native';

  import 'react-native-gesture-handler';
  import {createStackNavigator} from '@react-navigation/stack';
  import MainNavigation from './src/screens/MainNavigation'
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {Restart} from 'fiction-expo-restart';
  import * as Notifications from 'expo-notifications';
  import Constants from 'expo-constants';
  import { Audio } from 'expo-av';
  import NetInfo from '@react-native-community/netinfo';
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  
  
  const Stack = createStackNavigator();
  
  
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound:true,
        priority: 'max',
      });
    }
  
    return token;
  }
  
  function App({navigation}) {
  
    const[token,settoken]=React.useState('');
    const[user_type_id,settype]=React.useState('');
    const [expoPushToken, setExpoPushToken] = React.useState('');
    const[connection,setconnection]=React.useState('');
    const[connectionType,setconnectionType]=React.useState('');
    const [notification, setNotification] = React.useState(false);
    const [sound, setSound] = React.useState();
    const notificationListener = React.useRef();
    const responseListener = React.useRef();
    React.useEffect(() => {
    (
      async()=> {
        NetInfo.fetch().then(state => {
          console.log('Connection type', state.type);
          setconnectionType(state.type)
          console.log('Is connected?', state.isConnected);
          setconnection(state.isConnected)
        });
        let Token=''
        let user_type_id=''
        try{
         Token=await AsyncStorage.getItem('Token');
       user_type_id=await AsyncStorage.getItem('user_type_id');
       settoken(Token);
       settype(user_type_id)
        }
        catch(e)
        {
          console.log(e.message);
        }
      
        console.log("user_type_idComponentDidmoundApp",user_type_id);
        console.log("TokenComponentDidmoundApp",Token);
     
     //handle Notification 
     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
     // This listener is fired whenever a notification is received while the app is foregrounded
     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
       setNotification(notification);
     });
  
     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
       console.log(response);
     });
  
     return () => {
       Notifications.removeNotificationSubscription(notificationListener);
       Notifications.removeNotificationSubscription(responseListener);
       sound
       ? () => {
           console.log('Unloading Sound');
           sound.unloadAsync(); }
       : undefined;
    
     };
  
      }
  
      )();
       

    
        I18nManager.forceRTL(true);
      (async()=> {  
  

        try {
          await AsyncStorage.setItem('FirstTimeload', "FirstTime")
        //  console.log("tokeninside",AsyncStorage.getItem('@storage_Key'));
    
        } catch (e) {
         // console.log("Inside Store Data Errror" ,error.message)
        }
  
        try{
          console.log("value",await AsyncStorage.getItem('FirstTimeload'));
          if(await AsyncStorage.getItem('TestReload')!="FirstTime")
       {
           //FirstTime
           console.log("This iS the First Loaaaaaaaaaaad");
           Restart();
           await AsyncStorage.setItem('TestReload', "FirstTime")
       }
       else if(await AsyncStorage.getItem('FirstTimeload')=="FirstTime")
       {
         
        console.log("This Second Time To LOad");
      //  Restart();
       }
        }catch (e) {
          // console.log("Inside Store Data Errror" ,error.message)
         }
      }
  
      )()
      

      
  
    },[]);
    async function playSound() {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(
        // require('./assets/testMoney.mp3')
              );
     
  
      console.log('Playing Sound');
      await sound.playAsync();}
  
  // console.log("expoPushToken",expoPushToken)
  console.log(navigation)
  let howISLogin ="POS"
  let loginFlag="No"
  console.log("howISLogin",howISLogin);
  if(notification)
  {
   console.log( "Request",notification.request.content.body);
   playSound();
  }
  if(connectionType=="wifi")
  {
  return(
  <MainNavigation/>
  );
  }else{
    
  return(
    <MainNavigation/>
    );
  }
  }
  
  export { registerForPushNotificationsAsync }
  export default App;
  