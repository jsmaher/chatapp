import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {KeyboardAvoidingView, ScrollView,View,Image,Text,TouchableOpacity, YellowBox} from 'react-native';
import Firebase from '../../Config/Firebase/firebase'
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

export default class MessagePage extends React.Component {
  state = {
    messages: [],
    messageRec:'',
    currentUser:''
  }
    
  static navigationOptions = ({navigation})=> {
    return{
      headerTitle:<TouchableOpacity  onPress={()=>this.props.navigation.navigate('UserDetail',{user:navigation.getParam('user')})}> 
        <View style={{flex:1,flexDirection:'row'}}>
        <Image style={{marginTop:10,marginRight:10}} source={{uri:navigation.getParam('url')}}style={{width:50,height:50,borderRadius:50}}/> 
        <Text style={{marginTop:15,marginLeft:10,fontWeight:'bold'}}>{navigation.getParam('name')}</Text>
      </View> 
      </TouchableOpacity>
    }  
  }
  async  componentDidMount() {
    let Detail = this.props.navigation.state.params
    this.props.navigation.setParams({name:Detail.mesReciever.name,url:Detail.mesReciever.url,user:Detail.mesReciever});
    console.log(Detail.mesReciever)
    console.log(Detail.userData)

    let userData = this.props.navigation.state.params.mesReciever
    let CureentUser = this.props.navigation.state.params.userData

    let { messages } = this.state
    this.setState({
        CureentUser,
        userData
    })
    var that = this
    let check = [];
    await Firebase.firestore().collection(`chat-${userData.uid}`).where("ReciverId","==",CureentUser.uid).where("senderId","==",userData.uid).get().then(res => {
        res.forEach(doc=>{
            let data = doc.data()
            console.log(data,'123')
            data.chat.user={
                _id:2,
                avatar:data.chat.avatar,
            }
            data.chat.createdAt= new Date(),
            check.push(data.chat)
            messages.push(data.chat)

        })
    })

    await Firebase.firestore().collection(`chat-${CureentUser.uid}`).where("ReciverId","==",userData.uid).where("senderId","==",CureentUser.uid).get().then(res => {
        res.forEach(doc=>{
            let data = doc.data()
            console.log(data,'123')
            data.chat.user={
                _id:1,
                avatar:data.chat.avatar,
            }
            data.chat.createdAt= new Date(),
            check.push(data.chat)
            check.sort(function(a, b){return b.createdAt-a.createdAt});
            messages.push(data.chat)

            that.setState({
                messages:check
            })


        })
    })




}
onSend(messages = []) {
    let { userData, CureentUser } = this.state
    this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
    }))
    messages[0].senderId=CureentUser.uid,
    messages[0].ReciverId=userData.uid
    messages[0].avatar = CureentUser.url,
    messages[0].nameRec = userData.name,
    messages[0].avatarRec = userData.url,

    Firebase.firestore().collection(`chat-${CureentUser.uid}`).add({ senderId: CureentUser.uid, ReciverId: userData.uid, chat:messages[0] })

}
  // componentWillMount() {
  //   this.setState({
  //     messageRec:Detail.mesReciever,
  //     currentUser:Detail.userData,
  //     messages: [
  //       {
  //         _id: Detail.mesReciever.uid,
  //         name:Detail.mesReciever.name,
  //         text: 'Hello developer',
  //         createdAt: new Date(),
  //         user: {
  //           _id: Detail.userData.uid,
  //           name: Detail.userData.name,
  //           avatar: 'https://placeimg.com/140/140/any',
  //         },
  //       },
  //     ],
  //   })
  // }

  // onSend(messages = []) {
  //   let chat =  GiftedChat.append(this.state.messages, messages);
  //   Firebase.firestore().collection(`users/${this.state.messageRec.uid}`).doc(this.state.currentUser.uid).set({
  //     userNAme:this.state.currentUser.name,
  //     chats:chat
  //   });
  //   this.setState(previousState => ({
  //     messages: GiftedChat.append(previousState.messages, messages),
  //   }))
  // }

  render() {
    console.log(this.state.messages)
    return (
      <View style ={{flex: 1}}>
          <KeyboardAvoidingView keyboardVerticalOffset={90} style={{flex: 1,marginEnd: 20}} behavior="padding" enabled>
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
            _id: 1,
        }}
        />
        </KeyboardAvoidingView>
        </View>
    )
  }
}