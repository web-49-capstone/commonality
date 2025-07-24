import type {User} from "~/components/profile-matching-section";

type Props = {
    user: User
}

type RequestButtonProps = {
    onClick: () => void;
};

export function RequestSentButton({ onClick }: RequestButtonProps) {
    return (
        <button onClick={onClick} className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl w-full py-3 px-6 hover:cursor-pointer">Request to Connect</button>
    );
}

export function RequestSentContent({user}: Props) {
    return(
        <>
           <p className="text-lg text-gray-900">Requested to Connect with {user.userFirstName}!</p>
        </>
    )
}