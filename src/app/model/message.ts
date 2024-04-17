import { Time } from "@angular/common";


export class Message {
  message_id: number;
  timeMess:Time;
  userId:number;
  textMess: string | null;
  track: MessageTrack | null;
}

export class MessageTrack {
  trackUrl: string;
  trackName: string;
  trackAuthor: string;
}

