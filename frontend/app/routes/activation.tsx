import type {Route} from "../../.react-router/types/app/+types/root";
import {redirect, useNavigate, useNavigation} from "react-router";
import {useEffect} from "react";

export async function loader({params, request}: Route.LoaderArgs) {
    // This function is intentionally left empty as the activation process does not require any data fetching.
    // It serves as a placeholder for future enhancements if needed.
    const userActivationToken = params.userActivationToken;
    const activationFetch = await fetch(`${process.env.REST_API_URL}/sign-up/activation/${userActivationToken}`)
        }
export default function Activation() {
    const navigate = useNavigate()
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 2000); // Redirect after 5 seconds
        return () => clearTimeout(timer);
    })
    return (
        <>
            <div className="py-10">
                <p className="text-center">Activating...</p>
            </div>
        </>
        )
}