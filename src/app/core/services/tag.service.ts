import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private api: ApiService) {}

  getAll(): Observable<string[]> {
    return this.api.get<string[]>('/tags');
  }
}
