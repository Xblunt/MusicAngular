import { Time } from "@angular/common";
import { Track } from "./track";

export class Message {
  message_id!: number;
  timeMess!:Time;
  textMess!: string;
  track_id!: number;
  second!:number;
  first!:number;
 track!: Track ;
}
