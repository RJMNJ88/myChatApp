import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { View, Text } from 'react-native';
import { auth, db } from '../firebase';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';

// Async and NetInfo imports
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

const ChatScreen = ({navigation}) => {

  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const unsubscribe = db.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
      snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user
      }))
    ))
    
    return unsubscribe;

  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt,
      text,
      user
    } = messages[0]
    db.collection('chats').add({
      _id,
      createdAt,
      text,
      user
    })
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft:20 }}>
          <Avatar 
          rounded
          source={{ uri: auth?.currentUser?.photoURL }} 
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity style={{marginRight: 30}} onPress={signOut} >
          <AntDesign name='logout' size={24} color='black' />
        </TouchableOpacity>
      )
    })
  }, [])

  const signOut = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
      navigation.replace('Login')
    }).catch((error) => {
      // An error happened.
    });
  }

  componentDidMount = () => {
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
      } else {
        console.log('offline');
      }
    });
  }

  const getMessages = async() => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // const saveMessages = async() => {
  //   try {
  //     await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  const deleteMessages = async() => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <GiftedChat
    messages={messages}
    showAvatarForEveryMessage={true}
    onSend={messages => onSend(messages)}
    user={{
      _id: auth?.currentUser?.email,
      name: auth?.currentUser?.displayName,
      avatar: auth?.currentUser?.photoURL
    }}
    />
  )
}

export default ChatScreen
