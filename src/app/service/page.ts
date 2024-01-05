
import { Album } from '../model/album';
import { Track } from '../model/track';
import { User } from '../model/user';


export class Page<T> {

  content:  any;
  totalElements: number;
  totalPages: number;
  currentPage!: number;
  size: number;
  page!: number;

  constructor(content:any, totalPages: number, totalElements: number, size: number, currentPage: number) {

    this.content = content;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.size = size;
    this.currentPage = currentPage;
  }
}
