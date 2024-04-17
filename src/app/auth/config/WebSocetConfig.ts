import { RxStompConfig } from "@stomp/rx-stomp";

export const WebSocketConfig: RxStompConfig = {
  brokerURL: 'ws://localhost:8080/ws',
  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,
  reconnectDelay: -1
};
