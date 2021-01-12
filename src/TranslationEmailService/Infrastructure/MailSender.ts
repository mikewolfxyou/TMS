import {TranslationEmailRequest} from "../../Entities/TranslationEmailRequest";
import {injectable} from "inversify";
import * as nodemailer  from 'nodemailer';
import {TranslatedTask} from "../../TranslationManagementSystem/Models/Tasks/TranslatedTask";

export interface IMailSender {
    sendEmail(emailRequest: TranslationEmailRequest): Promise<void>;
}

@injectable()
class MailSender implements IMailSender {

    async sendEmail(emailRequest: TranslationEmailRequest): Promise<void> {

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        let mailBody: string = "Hello, \n Your requested translation files has been translated, you can downloaded now.\n";
        for (let i = 0; i < emailRequest.translationTasks.length; i++) {
            let task: TranslatedTask = emailRequest.translationTasks[i];
            mailBody += "original file: "  + task.translationRequest.originalFileName + ` download link: ` +
                task.translatedFilePath + "\n";
        }

        let info = await transporter.sendMail({
            from: '"Mike 👻" <mikewolfxyou@example.com>', // sender address
            to: emailRequest.email, // list of receivers
            subject: "Your translated file", // Subject line
            text: mailBody, // plain text body
            html: "", // html body
        });

        console.info("Message send: %s", info.messageId);
        console.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return Promise.resolve(undefined);
    }
}

export {MailSender}

