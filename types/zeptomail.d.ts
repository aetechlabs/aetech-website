declare module 'zeptomail' {
  export interface EmailAddress {
    address: string;
    name?: string;
  }

  export interface Recipient {
    email_address: EmailAddress;
  }

  export interface EmailMessage {
    from: EmailAddress;
    to: Recipient[];
    subject: string;
    htmlbody?: string;
    textbody?: string;
  }

  export interface ZeptoConfig {
    url: string;
    token: string;
  }

  export class SendMailClient {
    constructor(config: ZeptoConfig);
    sendMail(message: EmailMessage): Promise<any>;
  }
}
