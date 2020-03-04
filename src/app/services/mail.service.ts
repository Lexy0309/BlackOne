import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  public support_email = 'blacksone.app@gmail.com';
  public share_url = 'http://blacks.one/mail_service/send_mail.php';
  public share_a_feedback_url = 'http://blacks.one/mail_service/share_a_feedback.php';
  public report_url = 'http://blacks.one/mail_service/report.php';
  // public report_url = 'http://http://natureandseason.000webhostapp.com/mail_service/mail_service/report.php';
  token: any;
  constructor(
    public http: HttpClient
  ) {

  }

  // Custom method to add standard headers.
  public _addStandardHeaders(header: HttpHeaders) {
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    return header;
  }
  // custom method to initialize reqOpts
  public _initializeReqOpts(reqOpts) {
    if (!reqOpts) {
      reqOpts = {
        headers: new HttpHeaders(),
        params: new HttpParams()
      };
    }
    return reqOpts;
  }

  post(url, body: any, reqOpts?: any) {
    return this.http.post(url, body, reqOpts);
  }
}
