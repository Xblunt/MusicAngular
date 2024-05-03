export class Session{
  id: number;
  action: ActionStatus;
  trackTime: number;
  actionTime: number;
  playerId: number;
  trackUrl: string;
 }


 export enum ActionStatus{
   None = "None",
   Play = "Play",
   Pause = "Pause"
 }
