import * as React from 'react'; 

import {  View
  ,  Image, 
  //  useWindowDimensions  
  } from 'react-native';
  import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//import Registration from '../screens/Registration';
import Login from '../screens/Login';
//import test from './Test'


const Stack = createStackNavigator();





  function LoginStack({navigation}) {
  
    return (
      <Stack.Navigator initialRouteName="Login">

     
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
     
     {/* <Stack.Screen
          name="Registration"
          component={Registration}
         
          options={{headerShown: false}}
        /> */}
        

        {/* TESt */}

        {/* <Stack.Screen
          name="test"
          component={test}
          options={{headerShown: false}}
        /> */}

      </Stack.Navigator>
    );
  }
  



function MainNavigation() {

    return(
      <NavigationContainer>
 <LoginStack/>
 </NavigationContainer>
 

    );
}


export default MainNavigation;