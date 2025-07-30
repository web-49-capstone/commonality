import {commitSession, getSession} from "~/utils/session.server";
import {type FileUpload, parseFormData} from "@remix-run/form-data-parser";
import {uploadToCloudinary} from "~/utils/cloudinary.server";
import Geocodio from "geocodio-library-node";
import {jwtDecode} from "jwt-decode";
import {UserSchema} from "~/utils/models/user-schema";
import {redirect} from "react-router";

export async function editProfileAction(request: Request) {

// pull the userId from the session
    const session = await getSession(
        request.headers.get("Cookie")
    )

    const uploadHandler = async (file: FileUpload | string | undefined | null) => {
        if (!file || typeof file === "string" || !file.stream) {
            return undefined;
        }

        if (file.fieldName === 'userImgUrl') {
            try {
                const cloudinaryUrl = await uploadToCloudinary(file.stream());
                return cloudinaryUrl;
            } catch (error) {
                console.error("Cloudinary upload failed:", error);
                return undefined;
            }
        }

        return undefined;
    };


    const formData = await parseFormData(request, uploadHandler)
    const userInfo = Object.fromEntries(formData)
    const geocoder = new Geocodio(`${process.env.GEOCODIO_API_KEY}`);
    const location = await geocoder.geocode(`${userInfo.userCity}, ${userInfo.userState}`, [], 1)

    if (!location?.results?.length || !location.results[0]?.location) {
        return {
            success: false,
            error: 'Invalid location. Please enter a valid city and state.',
            status: 400
        }
    }

    const userLat = location.results[0].location.lat
    const userLng = location.results[0].location.lng

    const updatedUser = {
        ...session.data.user,
        ...userInfo,
        userLat,
        userLng
    }

    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }

    const response = await fetch(`${process.env.REST_API_URL}/users/${updatedUser.userId}`,
        {
            method: 'PUT',
            headers: requestHeaders,
            body: JSON.stringify(updatedUser),
        })
    const headers = response.headers
    const data = await response.json();
    if (data.status === 200) {
        const authorization = headers.get('authorization');
        if (!authorization) {
            session.flash('error', 'profile is malformed')
            return {success: false, error: 'internal server error try again later', status: 400}
        }
        const parsedJwtToken = jwtDecode(authorization) as any
        const validationResult = UserSchema.safeParse(parsedJwtToken.auth);
        if (!validationResult.success) {
            session.flash('error', 'profile is malformed')
            return {success: false, error: 'internal server error try again later', status: 400}
        }
        session.set('authorization', authorization);
        session.set('user', validationResult.data)
        const responseHeaders = new Headers()
        responseHeaders.append('Set-Cookie', await commitSession(session))
        return redirect("/profile", {headers: responseHeaders});
    }
    return {success: false, error: data.message, status: data.status};
}