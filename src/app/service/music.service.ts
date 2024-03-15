import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private audio: HTMLAudioElement = new Audio();

  constructor() {

  }

  playAudio(sourceUrl: string, event: Event): void {
    this.audio.src = sourceUrl;
    this.audio.play();
    console.log(`now playing: ${this.audio}, play event details: ${event}`);
  }

  pauseAudio(event: Event): void {
    this.audio.pause();
    console.log(`now playing: ${this.audio}, stop event details: ${event}`);
  }

}
