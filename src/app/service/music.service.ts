import {Injectable } from '@angular/core';
import { Chat } from '../model/chat';


@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private audios: { [chatId: number]: { [trackId: number]: HTMLAudioElement } } = {};
  private audioTimes: { [chatId: number]: { [trackId: number]: number } } = {};

  constructor() { }

  playAudio(sourceUrl: string, trackId: number, chatId: Chat): void {
    if (!this.audios[chatId.id]) {
      this.audios[chatId.id] = {};
      this.audioTimes[chatId.id] = {};
    }

    if (this.audios[chatId.id]) {
        for (const id in this.audios[chatId.id]) {
          if (id !== String(trackId)) {
            this.audios[chatId.id][id].pause();
            this.audioTimes[chatId.id][id] = this.audios[chatId.id][id].currentTime;
            console.log(`Paused track ${id}`);
          }
        }

        if (!this.audios[chatId.id][trackId]) {
          this.audios[chatId.id][trackId] = new Audio();
          this.audioTimes[chatId.id][trackId] = 0;
        }

        const audio = this.audios[chatId.id][trackId];
        audio.src = sourceUrl;
        audio.play();

        audio.addEventListener('timeupdate', () => {
          this.audioTimes[chatId.id][trackId] = audio.currentTime;
          // console.log(`Current time play for track ${trackId}: ${audio.currentTime}`);
        });
        console.log(`Now playing track ${trackId}`);
    } else {
        console.error(`No audio objects found for chatId: ${chatId}`);
    }
  }

  pauseAudio(trackId: number, chatId: Chat): void {
    const audio = this.audios[chatId.id][trackId];
    if (audio) {
      audio.pause();
      this.audioTimes[chatId.id][trackId] = audio.currentTime;
      console.log(`Paused track ${trackId}`);
    } else {
      console.log(`Track ${trackId} is not playing`);
    }
  }

  getTrackTime(trackId: number, chatId: Chat): number {
    if (this.audioTimes[chatId.id] && this.audioTimes[chatId.id][trackId]) {
      return this.audioTimes[chatId.id][trackId];
    } else {
      return 0;
    }
  }
}
