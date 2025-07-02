export interface Profile {
    firstName: string;
    lastName: string;
    bio: string;
    interests: string[];
    availability?: string;
    profilePicture?: File | null;

}