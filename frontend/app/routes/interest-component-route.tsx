// export async function loader ({request}: Route.LoaderArgs){
//     const session = await getSession(
//         request.headers.get("Cookie")
//     )
//     const url = new URL(request.url)
//     const q = url.searchParams.get("q")
//     const interests = await fetch(`${process.env.REST_API_URL}/interests/interestByInterestName/${q}`)
//     return {session, interests, q}
// }

export async function action({request, params}: Route.ActionArgs) {
    const formData = await request.formData()
    const interest = object.fromEntries(formData)
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', 'application/json')
    requestHeaders.append('Authorization', session.data?.authorization || '')
    const cookie = request.headers.get('Cookie')
    if (cookie) {
        requestHeaders.append('Cookie', cookie)
    }
    const response = await fetch(`${process.env.REST_API_URL}/interest/userInterestUserId`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(interest)
    })
}