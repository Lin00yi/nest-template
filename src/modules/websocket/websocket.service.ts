import { Injectable } from '@nestjs/common';
import { debounce } from 'lodash';

@Injectable()
export class WebsocketService {
  clients = {};
  userInfoMap = {};
  rooms = {};
  clearTime = 1000 * 15;

  MessageEventName = {
    OFFER: 'offer',
    ANSWER: 'answer',
    GET_OFFER: 'getOffer',
    ICE_CANDIDATE: 'icecandidate',
    LEAVE: 'leave',
    JOIN: 'join',
    RECONNECT: 'reconnect',
    RECONNECT_WORK: 'reconnectWork',
    ERROR: 'error',
  };

  ErrorMessageType = {
    REPEAT: 'repeat',
  };

  ErrorMessage = {
    repeat: '此房间该用户名已存在',
  };

  UserState = {
    JOIN: 'join',
    LEAVE: 'leave',
  };

  StreamTypeEnum = {
    USER: 'user',
    DISPLAY: 'display',
    REMOTE_DISPLAY: 'remoteDisplay',
  };

  log(desc, data) {
    console.log(desc, data);
  }

  leaveRoom(userId, needSend = false) {
    if (!userId) return;
    const userInfo = this.userInfoMap[userId];
    if (!userInfo) return;
    const roomname = userInfo.roomname;
    const room = this.rooms[roomname];
    delete room[userId];
    delete this.userInfoMap[userId];
    if (!Object.keys(room).length) {
      delete this.rooms[roomname];
    } else if (needSend) {
      this.sendLeaveMessage(userInfo);
    }
    console.log('退出');
  }

  sendLeaveMessage(userInfo) {
    Object.keys(this.StreamTypeEnum).forEach((key) => {
      const type = this.StreamTypeEnum[key];
      const connectorMap = userInfo[type];
      connectorMap?.forEach((connectorClient, connectorId) => {
        try {
          connectorClient.socket.emit(this.MessageEventName.LEAVE, {
            connectorId,
            memberId: userInfo.socketId,
          });
        } catch (error) {
          console.error(error);
        }
      });
    });
  }

  getDebouncedLeaveRoom() {
    const debouncedLeave = debounce(this.leaveRoom.bind(this), this.clearTime);
    return {
      debouncedLeave,
      cancel: debouncedLeave.cancel.bind(debouncedLeave),
    };
  }
}
