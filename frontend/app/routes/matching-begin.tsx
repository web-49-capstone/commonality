import {MyInterestsDropdown} from "~/components/my-interests-dropdown";

export default function MatchingBegin() {
    return(
        <>
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 lg:mt-10 container mx-auto">
                    <div className="text-center">
                        <img src="../../public/commonality-logo.png" alt="Commonality Logo" className="w-1/4 mx-auto"/>
                        <h2 className="text-4xl my-3">Let's Get Started!</h2>
                        <p className="text-xl text-gray-900 mx-10">Pick an interest from your profile to see other users with the same interest.</p>
                        <hr className="mt-10 lg:mb-10 w-3/5 mx-auto"/>
                        <p className="hidden lg:block text-xl text-gray-900 mb-2 font-bold">Want to start a new group instead?</p>
                    </div>
                    <div className="text-center content-center">
                        <h2 className="text-3xl lg:text-4xl my-5 lg:my-10">Find People Interested In:</h2>
                        <MyInterestsDropdown />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 lg:mt-0 container mx-auto">
                    <button className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl py-3 px-6 w-3/4 md:w-1/2 mx-auto lg:order-2">Begin Matching</button>
                    <p className="lg:hidden text-xl text-gray-900 mb-2 mt-4 font-bold text-center">Want to start a group instead?</p>
                    <button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl py-3 px-6 w-3/4 md:w-1/2 mx-auto lg:order-1">Create a Group</button>

                </div>
            </div>
        </>
    )
}