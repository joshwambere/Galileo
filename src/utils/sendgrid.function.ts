import SendGrid from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '@config';
export class SendgridService {
    private KEY:string;
    constructor() {
        this.KEY = SENDGRID_API_KEY;
        SendGrid.setApiKey(this.KEY);
    }

    async sendEmail(mail: SendGrid.MailDataRequired) {
        return await SendGrid.send(mail);
    }
}
