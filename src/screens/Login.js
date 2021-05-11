import * as React from 'react'; 
import { 
  Cairo_600SemiBold,
} from '@expo-google-fonts/cairo'
import * as Font from 'expo-font';
import {
     View ,
     TouchableOpacity,
    Text,
    StyleSheet,
    TextInput,
    Dimensions,
    ScrollView,
    BackHandler,
    Platform,
    ImageBackground,
  } from 'react-native'; 
  import * as Permissions from 'expo-permissions';
  import { AntDesign } from '@expo/vector-icons';
  import { EvilIcons  } from '@expo/vector-icons';
  import { MaterialCommunityIcons , Entypo
  } from '@expo/vector-icons'; 

  import {
    DotIndicator,
   } from 'react-native-indicators';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-tiny-toast';
import * as Location from 'expo-location';
import axios from 'axios';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
//import i18n from '../screens/i18n';
//import API_URL from '../screens/URL'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  
  let customFonts ={
    Cairo_600SemiBold,
  
  };
  
  export default class Login extends React.Component{
  
    state={
      user_phonenumber:"",
      user_password:"",
      Count:0,
      modalVisible:false,
      modalVisible1:false,
      ExpoPushToken:'',
      flag:true,
      locationPermission:'',
      pos_longatude:null,
      pos_latitude:null,
      fontLoaded: false,
      fontsLoaded: false,
    }
    
    
  phonevalidation='';
    passvalidtation='';
  
    async _loadFontsAsync() {
      await Font.loadAsync(customFonts);
      this.setState({ fontsLoaded: true });
    }
  
  
    storeData = async (value) => {
      try {
        await AsyncStorage.setItem('@storage_Key', value)
  
  
      } catch (e) {
      //  console.log("Inside Store Data Errror" ,error.message)
      }
  
    }
  
    validatePhone=(user_phonenumber)=>{
      if(user_phonenumber=="")
      {           this.phonevalidation="Enter your email"
                  return false;
      }
      else
      {
        const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (reg.test(user_phonenumber) === false) {
          this.setState({
            validatePhone: false,
            telephone: user_phonenumber,
          });
          return false;
        } else {
          this.setState({
            validatePhone: true,
            telephone: user_phonenumber,
            message: "Email is not verified"
          });
          return true;
        }
      
         
  
      }
  }
  
  
  
  async  registerForPushNotificationsAsync() {
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
     // console.log("inlogin",token);
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
  this.setState({ExpoPushToken:token})
    return token;
  }
  
  
  
  
  
  
  

  componentDidMount= async()=> {
  
  this._loadFontsAsync();
  
  const gpsEnabledornot=await Location.getProviderStatusAsync();
  console.log("gpsEnabledornot",gpsEnabledornot);
  if(gpsEnabledornot.gpsAvailable==true)
  {
  const  status= await Location.requestForegroundPermissionsAsync();
  console.log("status out login",status.status);
   if(status.status=="granted")
   { 
         console.log("status in login",status.status);
       let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
    // setLocation(location);
    console.log("location",location);
        this.setState({pos_longatude:location.coords.longitude,pos_latitude:location.coords.latitude})
   }
  }
   await Font.loadAsync({
    'Cairo-SemiBold': require('../../assets/fonts/Cairo-SemiBold.ttf'),
  });
  this.setState({ fontLoaded: true});

   
  
   }
  validatePassword=(user_password)=>{
    if(user_password=="")
    {           this.passvalidtation="Enter password"
                return false;
    }
    else
    {
         return true
  
    }
  }
  
  
  
  
    sayhi = () => {
   //   console.log("hiiiiiiiiiiiiiiiiiiiiii sayyy ");
    this.setState({flag:true})  ;
    }
  
  async onLoginPressed() {

  
   
    const deviceId = Constants.deviceId;
    let data={
      user_phonenumber:this.state.user_phonenumber,
      user_password:this.state.user_password,
      device_identifier:deviceId,
    posCurrentLongitude:this.state.pos_longatude,
    posCurrentLatitude:this.state.pos_latitude
    
    }                  
    let passpattern=/^(?=.*\d+)(?=.*[a-zA-Z])[0-9a-zA-Z]{4,100}$/
    // ||this.state.user_password.match(passpattern)==null
   if(this.state.user_phonenumber==''||this.state.user_phonenumber.length!=11||this.state.user_password.match(passpattern)==null)
   {
    Toast.showSuccess("Please enter the right data",{
      containerStyle:{backgroundColor:"red"},
      textStyle: {fontSize:19}
      
     })
   }
   else
   {
    this.setState({flag:false});
    setTimeout(this.sayhi,4000);
    try {
   //   console.log("hhhhhhhhhhhhh");
    //  const response = await axios.post(API_URL+'login',data);
   //   console.log("hhhhhhhhhhhhh");
    //  console.log("Responseeeeee",response.data)
      if(response.data == "Token UnAuthorized")
      { //   console.log("ssss");
        Toast.showSuccess("The System is off",{
          containerStyle:{backgroundColor:"red"},
          textStyle: {fontSize:19}
          
         })
      }
    //  else if(JSON.stringify(response.data.message).replace(/\"/g, "")=="user account not activated")
    //   {
  
    //     Toast.showSuccess(i18n.t('useraccountnotactivated'),{
    //       containerStyle:{backgroundColor:"red"},
    //       textStyle: {fontSize:19}
          
    //      })
    //   }
  
     
    
    //   else if(JSON.stringify(response.data.message).replace(/\"/g, "")=="user not registered")
    //   {
    
    //     Toast.showSuccess(i18n.t('Usernotregistered'),{
    //       containerStyle:{backgroundColor:"red"},
    //       textStyle: {fontSize:19}
          
    //      })
    //   }
         
    //   else if(JSON.stringify(response.data.message).replace(/\"/g, "")=="user is found, phone number not verified")
    //   {
    //     Toast.showSuccess(i18n.t('userisfoundphonenumbernotverified'),{
    //       containerStyle:{backgroundColor:"red"},
    //       textStyle: {fontSize:19}
          
    //      })
    //   }
  
    //   else if(JSON.stringify(response.data.message).replace(/\"/g, "")=="incorrect username or password")
    //   {      Toast.showSuccess(i18n.t('IncorrectPasswordOrphonenumber'),{
    //        containerStyle:{backgroundColor:"red"},
    //        textStyle: {fontSize:19}
    //       })
    //   }
  
    //   else if(JSON.stringify(response.data.message).replace(/\"/g, "")==="user Logged in successfully")
    //   {
    
    //   if (response.data.user_type_id != 3){
    //   //  console.log("usernotpos");
    //     Toast.showSuccess(i18n.t('IncorrectPasswordOrphonenumber'),{
    //       containerStyle:{backgroundColor:"red"},
    //       textStyle: {fontSize:19}
          
    //      })
    //   }
  
      else{
  
   // console.log("res9999",response.data.dealerId);
        const AccessToken= JSON.stringify(response.data.usertoken).replace(/\"/g, "")
        const posType= JSON.stringify(response.data.posType).replace(/\"/g, "")
       const dealerId= JSON.stringify(response.data.dealerId).replace(/\"/g, "")
        const user_type_id= JSON.stringify(response.data.user_type_id).replace(/\"/g, "")
        const user_phonenumber= JSON.stringify(response.data.phoneNumber).replace(/\"/g, "")
        const userEmail= JSON.stringify(response.data.userEmail).replace(/\"/g, "")
        const userFirstName= JSON.stringify(response.data.userFirstName).replace(/\"/g, "")
        const usermiddleName= JSON.stringify(response.data.usermiddleName).replace(/\"/g, "")
        const userLastName= JSON.stringify(response.data.userLastName).replace(/\"/g, "")
        const virtualMoneyBalance= JSON.stringify(response.data.virtualMoneyBalance).replace(/\"/g, "")
        const area= JSON.stringify(response.data.area).replace(/\"/g, "")
        const region= JSON.stringify(response.data.region).replace(/\"/g, "")
       const regionId= JSON.stringify(response.data.regionId).replace(/\"/g, "")
       const userId= JSON.stringify(response.data.userId).replace(/\"/g, "")
       const  userIdInUsers=JSON.stringify(response.data.userIdInUsers).replace(/\"/g, "")
       const commercialName= JSON.stringify(response.data.commercialName).replace(/\"/g, "")
        AsyncStorage.setItem('Token', AccessToken) 
       AsyncStorage.setItem('dealerId', dealerId) 
        AsyncStorage.setItem('posType', posType) 
        AsyncStorage.setItem('regionId', regionId) 
        AsyncStorage.setItem('commercialName', commercialName) 
        AsyncStorage.setItem('userId', userId) 
        AsyncStorage.setItem('user_type_id', user_type_id)
        AsyncStorage.setItem('user_phonenumber', user_phonenumber)
        AsyncStorage.setItem('userEmail', userEmail)
        AsyncStorage.setItem('userFirstName', userFirstName)
        AsyncStorage.setItem('usermiddleName', usermiddleName)
        AsyncStorage.setItem('userLastName', userLastName)
        AsyncStorage.setItem('virtualMoneyBalance', virtualMoneyBalance)
        AsyncStorage.setItem('area', area)
        AsyncStorage.setItem('region', region)
        AsyncStorage.setItem('userIdInUsers', userIdInUsers) 
      
        //this.setState({user_phonenumber: ''})
        let data={}
  
   this.registerForPushNotificationsAsync().then(async token => {
   //  console.log("Tokennn",token);
     try {
     //  console.log("fffffffffff");
    //  const response = await axios.post(API_URL+'notificationtoken',{userId: parseInt(await AsyncStorage.getItem('userIdInUsers'),10),userToken:token});
   //   console.log("Response",response);
     }
    
     catch(e)
     {
    //   console.log(e.message);
     }
    });
  
    
        let Token=''
        let user_type_id2=''
        try{
          Token=await AsyncStorage.getItem('Token');
        user_type_id2=await AsyncStorage.getItem('user_type_id');
       
         }
         catch(e)
         {
           console.log(e.message);
         }
    
  
     
        if(user_type_id2== 3){ //POS
   
   
        Toast.showSuccess("Welcome",{
          containerStyle:{backgroundColor:"green"},
          textStyle: {fontSize:19}
          
         })
              // console.log("HIII");
             //  console.log("PushTokennnn",this.state.ExpoPushToken);
     // this.props.navigation.navigate('test')
         this.setState({user_password:''});
        
       
     }
     else{
  
      Toast.showSuccess("Please be sure of your data",{
        containerStyle:{backgroundColor:"red"},
        textStyle: {fontSize:19}
        
       })
  
     }
  
    }
      }
  
  
     catch (error) {
    
      console.log(error)
    //   if(error.response.data.message == "user account not activated")
    //   {     // console.log("if");
    //     Toast.showSuccess(i18n.t('useraccountnotactivated'),{
    //       containerStyle:{backgroundColor:"red"},
    //       textStyle: {fontSize:19}
          
    //      })
    //   }
    //   else if(error.response.data.message == "user tried to login from unauthroized device update a device")
    //   {
  
    //     Toast.showSuccess(i18n.t('user tried to login from unauthroized device update a device'),{
    //       containerStyle:{backgroundColor:"red"},
    //       textStyle: {fontSize:19}
          
    //      })
    //      this.setState({modalVisible1:true})
    //   }
    //  else if(error.response.data.message == "incorrect username or password")
    //   {      this.setState({Count:this.state.Count+1})
    //       //   console.log("Password Error", this.state.Count);
    //           Toast.showSuccess(i18n.t('IncorrectPasswordOrphonenumber'),{
    //             containerStyle:{backgroundColor:"red"},
    //             textStyle: {fontSize:19}     
    //           })
  
       if(this.state.Count>=3)
       {
         //axios call to make user suspended
         //open modal to tell him
         try{
            const response = await axios.post(
            'suspenduser',{user_phonenumber:this.state.user_phonenumber})
          //  console.log("Response",response);
            if(response.data.message=="user is suspended for multiple fail loggin")
            {
            //  console.log("Suspend User");
              this.setState({modalVisible:true})
  
        try{
         await AsyncStorage.setItem("FailedToLOGIN3Time","3")
       }
       catch(e)
       {
         console.log(e.message);
       }
            }
            }
        catch(e)
        {
          console.log(e.message);
        }
       
       }
      
      else if(error.response.data.message == "user not registered")
      {    //  console.log("if");
        Toast.showSuccess("User is not registered yet",{
          containerStyle:{backgroundColor:"red"},
          textStyle: {fontSize:19}
          
         })
      }
      else
      {Toast.showSuccess("Wrong password or Email",{
        containerStyle:{backgroundColor:"red"},
        textStyle: {fontSize:19}
        
       })
      }
    }
  
   }
  }
  
  render(){
  if(this.state.fontsLoaded==false)
  {
    return(
  
      <DotIndicator color="#4e31c1" />
      
      );
  }
  return (
   
   
   
   <>
  
  
  
  
  
        <View style={styles.containerBig}>
  
  <ImageBackground 
      source={require('../../assets/top.png')}
      style={{
        height:"100%", 
      width:Dimensions.get('window').width,alignself:'center',flex:1}}>
          </ImageBackground>
      </View>
  <View style={{
  
    flex:2,
    backgroundColor:'#F1F2E0'
  }}>
     <ScrollView style={{backgroundColor:'#F1F2E0',alignself:'center',borderTopLeftRadius:50,borderTopRightRadius:50,marginTop:hp('-1%')}} >
          <View >
  <View    
     style={{
  alignSelf:'center',
  marginTop:hp('1%')
  
     }}>
  <EvilIcons name="user" size={160} color="#599A5F"  />
  
  
  </View>
       
          <View style={styles.searchSection}>
  
      
  <TextInput      
  
       underlineColorAndroid='transparent'
       value={this.state.user_phonenumber}
       style={styles.input}
        keyboardType="email-address"
        onChangeText={(text) => this.setState({user_phonenumber: text})}
        underlineColorAndroid="transparent"
        placeholder="Enter your email"
        placeholderTextColor = "#599A5F"
       />
   
  <Entypo name="email" size={25} color="#599A5F"style={{paddingRight:8}} />
  {/* </View> */}
  </View>
  
  
  
               <View style={styles.searchSection}>
  
               <TextInput
            
            secureTextEntry={true}
            value={this.state.user_password}
            placeholder="Enter password"
            placeholderTextColor = "#599A5F"
              style={styles.input}
              autoCompleteType="password"
              onChangeText={(text) => this.setState({user_password: text})}
              underlineColorAndroid="transparent"
            />
        
              <AntDesign name="lock" size={25} color="#599A5F" style={{paddingRight:8}} />
  </View>

  {/* 
  onPress={() => this.onLoginPressed()    } */}
  {(this.state.flag == true)?
   <TouchableOpacity style={styles.button}     >
   <Text style={styles.btnText}>Login</Text>
  
  
  </TouchableOpacity>
  :
  <TouchableOpacity style={styles.button} disabled={true}   >
  <Text style={styles.btnTextfalse}>Login</Text>
  
  
  </TouchableOpacity>
  }
  <Text
  style={{
  color:'#599A5F',
  alignSelf:'flex-start',
  fontFamily:'Cairo_600SemiBold',
  fontSize:20,
  marginTop:hp('2%'),
  marginBottom:hp('1%'),
    padding:wp('2%'),
    marginLeft:wp('4%'),
    height:hp('6%'),

  }}
 >
  Forget Password ??
  
  </Text>
  {/* <Text
  style={{
  color:'#599A5F',
  alignSelf:'center',
  textAlign: "center",
  fontFamily:'Cairo_600SemiBold',
  fontSize:30,
 // underlineColorAndroid:"#000",
//   marginTop:hp('5%'),
  marginBottom:hp('1%')
  }}
  onPress={() => { this.props.navigation.navigate('Registration')}}>
  
  
  </Text> */}
  
  <TouchableOpacity style={styles.Registerbutton} disabled={true}   >
  <Text style={styles.btnText}>Registration</Text>
  
  
  </TouchableOpacity>
  
  </View>
  </ScrollView>
  
   
  
  </View>
  
  
  
  
  
  
  
  
  
  </>
  
  );
  //}
  }
  }
  
  const styles = StyleSheet.create({
      container: {
        
         flex: 1,
         backgroundColor:"#fff"
        },
  
        Registerbutton: {
            backgroundColor: "#599A5F",
            borderColor:'#599A5F',
             padding:wp('2%'),
             fontFamily:'Cairo_600SemiBold',
             borderRadius:40,
             borderWidth: wp('0.3%'),
             width:wp('58%'),
             height:45,
             alignSelf:'center',
             //marginLeft:wp('9%'),
             marginTop:hp('4%'),
             shadowColor: "#000",
             shadowOffset: {
               width: 20,
               height: 10,
             },
             shadowOpacity:50,
             shadowRadius: 60,
             elevation: 20,
            textAlign:"center",
  
        },
        RegisterbtnText:
        {
          color: "#599A5F",
          fontSize: wp('6%'),
          textAlign: "center",
          fontFamily:'Cairo_600SemiBold',
          
          alignSelf:'center',
        //  marginLeft:wp('5%'),
         marginTop:hp('5%'),
        },
  
        button: {
        backgroundColor: "#599A5F",
        borderColor:'#599A5F',
         padding:wp('2%'),
         fontFamily:'Cairo_600SemiBold',
         borderRadius:40,
         borderWidth: wp('0.3%'),
         width:wp('38%'),
         height:45,
         alignSelf:'flex-start',
         marginLeft:wp('9%'),
         marginTop:hp('4%'),
         shadowColor: "#000",
         shadowOffset: {
           width: 20,
           height: 10,
         },
         shadowOpacity:50,
         shadowRadius: 60,
         elevation: 20,
        textAlign:"center",
        },
        searchSection: {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          width:wp('20%'),
          alignSelf:'center',
          marginTop:hp('4%')
      },
      searchIcon: {
          padding: 10,
      },
      input: {
        marginTop:hp('-0.9%'),
        fontSize: wp('5%'),
        borderRadius:10,
        // borderColor:"#D3D3D3",
        // borderWidth:2.5,
        alignSelf:"center",
        color: '#000000',
        height:hp('6%'),
        width:wp('67.6%'),
        backgroundColor:"#fafafc",
        shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity:50,
                shadowRadius: 60,
                elevation: 20,
  
        textAlign:"center",
        fontFamily:'Cairo_600SemiBold',
      },
        button2: {
          backgroundColor: "transparent",
          marginLeft:wp('10%'),
          
        },
        btnText2: {
          color: "red",
          color:"#4e31c1",      
          marginLeft:hp('10%'),
          fontSize:wp('7%'),
          fontFamily:'Cairo_600SemiBold',
          
          alignSelf:'center',
          marginBottom:hp('25%'),
          marginTop:hp('5%'),
          
        },
        btnText: {
     color: "#fff",
     fontSize:25,
     textAlign: "center",
     fontFamily:'Cairo_600SemiBold',
     alignSelf:'center',
     marginTop:hp('-1%'),
        },
     
        btnTextfalse: {
          color: "#fff",
          textAlign: "center",
          fontSize:25,
          textAlign: "center",
          fontFamily:'Cairo_600SemiBold',
          
          marginTop:hp('-1%'),
        },
        inputStyle: {
      
          marginTop:hp('-0.9%'),
              fontSize: wp('5%'),
              borderRadius: 100,
              borderColor:"#D3D3D3",
              borderWidth:2.5,
              alignSelf:"center",
              color: '#000000',
              height:hp('6%'),
              width:wp('67.6%'),
              backgroundColor:"#FFFFFF",
              shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 10,
                      },
                      shadowOpacity:50,
                      shadowRadius: 60,
                      elevation: 20,
  
              textAlign:"center",
             
          
            },
            errormessage:{
  color:"#fff",
  marginTop:hp('1%'),
            },
  
            InputsOut:{
            
            //  marginBottom:hp('2%'),
            fontSize: wp('5%'),
            borderRadius: 70,
            borderColor:"#4e31c1",
            borderWidth: 9,
            alignSelf:"center",
            color: '#000000',
            height:hp('6.9%'),
            width:wp('69.8%'),
            backgroundColor:"#FFFFFF",
            shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                    shadowOpacity:50,
                    shadowRadius: 60,
                    elevation: 20,
            },
          
            Inputs:{
              marginTop:hp('-1%'),
            //  marginBottom:hp('2%'),
              fontSize: wp('5%'),
              borderRadius: 70,
              borderColor:"#FFF",
              borderWidth: 9,
              alignSelf:"center",
              color: '#000000',
              height:hp('6.5%'),
              width:wp('69%'),
              backgroundColor:"#FFFAFA",
              shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 10,
                      },
                      shadowOpacity:50,
                      shadowRadius: 60,
                      elevation: 20,
          
          
          
            },
    
  
        InputsContainer:{      
          top: hp('30%'),
          marginBottom:hp('2%'),  
         },
         InputsContainer2:{
         
          top: hp('30.5%'),
          marginBottom:hp('2%'),
      
     
         },
  
         InputsContainerbutton:{
         
        top: hp('7%'),
        alignSelf:'flex-start'
     
         },
  
        tinyLogo:{
         top:hp('20%'),
         height:hp('30%'),
         width: wp('50%'),
          
       
        },
        image: {
          position:'absolute',
          height:hp('100%'),
          width:wp('100%'),
         // marginTop:hp('-5%'),
     
        },
   
      subTitle: {
        // top: hp('33%'),
         color:"#4e31c1",      
        //  marginLeft:hp('4%'),
        //  marginRight:wp('5%'),
        fontSize:wp('5%'),
        fontFamily:'Cairo_600SemiBold',
        
        //marginBottom:hp('3%')
      },
      NotAuthorizrd:{
        position:'absolute',
        width:wp('100%'),
        height:hp('100%'),
        marginTop:hp('16%'),
       },
  
       btnText6: {
        color: "#C81717",
        fontSize: wp('8%'),
        justifyContent: "center",
        textAlign: "center",
        fontFamily:'Cairo_600SemiBold',
        
        marginTop:wp('129%'),
      }, 
  
      btnText7: {
        color: "#C81717",
        fontSize: wp('6%'),
        justifyContent: "center",
        textAlign: "center",
        fontFamily:'Cairo_600SemiBold',
        marginTop:wp('12%'),
      }, 
  
      Title: {
          top: hp('27%'),
          color:"#FFFFFF",      
          //  marginLeft:hp('7.5%'),
          //  marginRight:wp('5%'),
          fontSize:wp('5%'),
          fontFamily:'Cairo_600SemiBold',
          
      
        }
        ,
        
        TitleNewaccount: {
         marginTop:hp('15%'),
          color:"#4e31c1",      
          marginLeft:hp('10%'),
          fontSize:wp('7%'),
          fontFamily:'Cairo_600SemiBold',
          
          // marginBottom:hp('2%'),
        },
  
  
  
        
       modalView: {
        margin: wp('10%'),
        backgroundColor: "white",
        borderRadius: 20,
        padding: wp('20%'),
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
       width:wp('85%'),
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      modalText: {
        marginBottom: wp('10%'),
        textAlign: "center",
        fontSize:25,
        fontFamily:'Cairo_600SemiBold',
        fontSize:wp('6%'),
        color:"#4e31c1"
      },
  
      button13:{
  
        backgroundColor: "#562dc7",
        borderColor:'#562dc7',
         padding:wp('2%'),
         fontFamily:'Cairo_600SemiBold',
         borderRadius:10,
         borderWidth: wp('0.3%'),
         width:wp('68%'),
         height:hp('7%'),
         alignSelf:'center',
         marginRight:wp('9%'),
         marginTop:hp('5%'),
         shadowColor: "#000",
         shadowOffset: {
           width: 20,
           height: 10,
         },
         shadowOpacity:50,
         shadowRadius: 60,
         elevation: 20,
        textAlign:"center",
      },
      btnText33: {
        color: "#FFF",
        fontSize: wp('5%'),
        justifyContent: "center",
        textAlign: "center",
     fontFamily:'Cairo_600SemiBold',
        alignSelf:"center",
       // marginTop:hp("1.5%")
      
      },
      ///////////////////////////////////////////////////////////////////////////////////////////////////
      Title1: {
       top: hp('4%'),
        color:"#4e31c1",      
        marginLeft:hp('6.5%'),
        //  marginRight:wp('1%'),
        fontSize:wp('5%'),
        fontFamily:'Cairo_600SemiBold',
  
      
      }
      ,
      inputStyle1: {
        marginTop:hp('-0.9%'),
            fontSize: wp('5%'),
            borderRadius: 100,
            borderColor:"#D3D3D3",
            borderWidth:2.5,
            alignSelf:"center",
            color: '#000000',
            height:hp('6%'),
            width:wp('67.6%'),
            backgroundColor:"#FFFFFF",
            shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                    shadowOpacity:50,
                    shadowRadius: 60,
                    elevation: 20,
            textAlign:"center",
          },
       
          InputsOut1:{
          //  marginBottom:hp('2%'),
            fontSize: wp('5%'),
            borderRadius: 70,
            borderColor:"#4e31c1",
            borderWidth: 9,
            alignSelf:"center",
            color: '#000000',
            height:hp('6.9%'),
            width:wp('69.8%'),
            backgroundColor:"#FFFFFF",
            shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                    shadowOpacity:50,
                    shadowRadius: 60,
                    elevation: 20,
          },
          Inputs1:{
            marginTop:hp('-1%'),
          //  marginBottom:hp('2%'),
            fontSize: wp('5%'),
            borderRadius: 70,
            borderColor:"#FFF",
            borderWidth: 9,
            alignSelf:"center",
            color: '#000000',
            height:hp('6.5%'),
            width:wp('69%'),
            backgroundColor:"#FFFAFA",
            shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                    shadowOpacity:50,
                    shadowRadius: 60,
                    elevation: 20,
          },
      InputsContainer1:{
        top: hp('27.3%'),
        marginBottom:hp('2%'),
       },
       POS1:{
        fontSize: wp('7%'),
        textAlign: 'left',
       // marginTop: hp('15%'), 
        color:"#FFFFFF",
        fontFamily:'Cairo_600SemiBold',
    width:Dimensions.get('window').width*0.7,
    marginBottom:hp('11%'),
      },
      POS3:{
        fontSize: wp('7%'),
        textAlign: 'left',
     marginTop: hp('2%'), 
        color:"#FFFFFF",
        fontFamily:'Cairo_600SemiBold',
    
     
      },
      POS:{
           fontSize: wp('7%'),
           textAlign: 'left',
        
           color:"#FFFFFF",
           fontFamily:'Cairo_600SemiBold',
          
        //marginTop:hp('15%'),
        //marginBottom:hp('2%'),
      
       },
         containerBig:{
           flex: 1,  
           backgroundColor:'#F1F2E0'
       },
       
     
         POSphone:{
             fontSize: wp('5%'),
             textAlign: 'center',
             marginTop: hp('5%'), 
        },
         image: {
           position:'absolute',
           width:wp('100%'),
           height:hp('120%'),
         },
         container: {
           borderWidth:wp('0.2'),
           borderColor:"#C81717",
           alignItems: 'center',
           borderRadius:10,
           marginRight:wp('2%'),
           marginLeft:wp('20%'),
           top: hp('1%'),
           height:hp('30%'),
           width:hp('30%'),
           //marginBottom:hp('1%'),
          },
          tinyLogo:{
            top:hp('1%'),
        height:hp('30%'),
        width: wp('60%'),
        marginLeft:wp('20%'),
         
          },
    
          NotAuthorizrd:{
            position:'absolute',
            width:wp('100%'),
            height:hp('100%'),
            marginTop:wp('16%'),
           },
          
           btnText6: {
            color: "#C81717",
            fontSize: wp('8%'),
            justifyContent: "center",
            textAlign: "center",
            fontFamily:'Cairo_600SemiBold',
            
            marginTop:wp('129%'),
          }, 
          ImageAsiacell:{
            //  marginLeft:wp('25%'),
              marginBottom:hp('1%'),
              marginTop:hp('-1%'),
              //padding:wp('11%'),
              //marginRight:wp('-1.5%')
            },
            ImageAsiacell3:{
              //  marginLeft:wp('25%'),
                marginBottom:hp('1%'),
                marginTop:hp('-0.32%'),
                //padding:wp('11%'),
                //marginRight:wp('-1.5%')
              },
            ImageAsiacell1:{
              //  marginLeft:wp('25%'),
                marginBottom:hp('1%'),
                marginTop:hp('2%'),
                //padding:wp('11%'),
                //marginRight:wp('-1.5%')
              },
            ImageAsiacell22:{
             alignSelf:'flex-end',
                marginBottom:hp('5%'),
                //marginTop:wp('15%'),
                //padding:wp('11%'),
                //marginRight:wp('-1.5%')
              },
      
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
    });
  