import {Link} from "react-router";
import React from "react";

export default function MatchingBegin() {
    // const {userInterests, userId, interestId} = loaderData;
    return(
        <>
            <div className="max-w-4xl min-w-1/2 mx-auto p-6">
                <div className="w-full bg-white shadow-xl rounded-3xl p-6 sm:px-10 space-y-10 transition-all">
                    <div className="text-center">
                        <img src="/commonality-logo.png" alt="Commonality Logo" className="w-1/4 mx-auto"/>
                        <h2 className="text-4xl my-3">Let's Get Started!</h2>
                        <h3 className="text-xl lg:text-xl my-5 lg:my-10">Click the button below to begin matching with others.</h3>
                        {/*<MyInterestsDropdown userInterests={userInterests} />*/}
                        <Link to="/connect"><button className="bg-gradient-to-br from-blue-400 to-blue-500 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-xl shadow transition cursor-pointer">Begin Matching</button></Link>

                        {/*<p className="text-xl text-gray-900 mx-10">Pick an interest from your profile to see other users with the same interest.</p>*/}
                        {/*<hr className="mt-10 lg:mb-10 w-3/5 mx-auto"/>*/}
                        {/*<p className="hidden lg:block text-xl text-gray-900 mb-2 font-bold">Want to start a new group instead?</p>*/}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 lg:mt-0 container mx-auto">
                    {/*<p className="lg:hidden text-xl text-gray-900 mb-2 mt-4 font-bold text-center">Want to start a group instead?</p>*/}
                    {/*<button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl py-3 px-6 w-3/4 md:w-1/2 mx-auto lg:order-1">Create a Group</button>*/}

                </div>
            </div>
        </>
    )
}