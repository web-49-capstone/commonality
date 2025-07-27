import {z} from "zod/v4";

export const MessageSchema = z.object({
    messageId: z.uuidv7("please provide a valid uuid7 for messageId"),
    messageReceiverId: z.uuidv7("please provide a valid uuid7 for messageReceiverId"),
    messageSenderId: z.uuidv7("please provide a valid uuid7 for messageSenderId"),
    messageBody: z.string("messageBody must be a string")
        .min(1, "messageBody must be at least 1 character")
        .max(1000, "messageBody must be at most 1000 characters")
        .trim(),
    messageOpened: z.boolean("messageOpened must be a boolean"),
    messageSentAt: z.coerce.date("please provide a valid date string for messageSentAt"),
})
export const PartnerMessageSchema = z.object({
    messageId: z.uuidv7("please provide a valid uuid7 for messageId"),
    messageSenderId: z.uuidv7('please provide a valid uuid7 for messageSenderId'),
    messageReceiverId: z.uuidv7('please provide a valid uuid7 for messageReceiverId'),
    messageBody: z.string('messageBody must be a string'),
    messageOpened: z.boolean('messageOpened must be a boolean'),
    messageSentAt: z.coerce.date('please provide valid date'),
    partnerId: z.uuidv7('please provide a valid uuid7 for partnerId'),
    partnerName: z.string('partnerName must be a string'),
    partnerImg:z.string('Please provide valid imgUrl')
        .max(255, 'Please provide a valid userImgUrl (max 255 characters)')
        .trim()
});
export type PartnerMessage = z.infer<typeof PartnerMessageSchema>
export type Message = z.infer<typeof MessageSchema>