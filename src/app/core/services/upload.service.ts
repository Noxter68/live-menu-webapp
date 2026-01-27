import { Injectable } from '@angular/core';
import { Observable, switchMap, map } from 'rxjs';
import { ApiService } from './api.service';

export interface SignUploadResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private api: ApiService) {}

  signUpload(fileName: string, contentType: string, entityType?: string, entityId?: string): Observable<SignUploadResponse> {
    return this.api.post<SignUploadResponse>('/uploads/sign', {
      fileName,
      contentType,
      entityType,
      entityId
    });
  }

  uploadFile(file: File, entityType?: string, entityId?: string): Observable<string> {
    return this.signUpload(file.name, file.type, entityType, entityId).pipe(
      switchMap(response =>
        this.api.upload(response.uploadUrl, file, file.type).pipe(
          map(() => response.publicUrl)
        )
      )
    );
  }
}
