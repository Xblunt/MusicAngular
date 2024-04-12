import { Time } from "@angular/common";
import { Track } from "./track";

export class Message {
  message_id: number;
  timeMess:Time;
  userId:number;
  trackUrl: string;
  trackName: string;
  trackAuthor: string;
  textMess: string | null;

  track: Track | null;
}

/*
export class MessageTrack {
  trackUrl: string;
  trackName: string;
  trackAuthor: string;
}
*/
