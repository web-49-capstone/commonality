export interface Profile {
    userFirstName: string;
    userLastName: string;
    userBio: string;
    interests: string[];
    userAvailability?: string;
    userImgUrl?: File | null;
    userCity: string;
    userState: string;


}