

import{SENDER_EMAIL} from '@config';

export class EmailFormatter {
    private senderEmail:string;
    constructor() {
        this.senderEmail = SENDER_EMAIL
    }

    confirmEmail(email: string, template: string, subject: string) {
        return {
            to: email,
            subject: subject,
            from: this.senderEmail,
            text: `Please confirm your email`,
            html: template,
        };
    }
    resetPassword(email: string, template: string, subject: string) {
        return {
            to: email,
            subject: subject,
            from: this.senderEmail,
            text: `Generate new password`,
            html: template,
        };
    }
}
