export interface User {
    userId: string;
    userName: string;
    userBio: string;
    userCreated: string;
    userAvailability?: string;
    userImgUrl?: File | null;
    userCity: string;
    userState: string;
}