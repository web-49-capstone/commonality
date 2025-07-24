export interface User {
    userId: string;
    userName: string;
    userBio: string;
    userCreated: string;
    userAvailability?: string;
    userImgUrl?: string;
    userCity: string;
    userState: string;
    userLat: number | null;
    userLng: number | null;
}