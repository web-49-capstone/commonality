import {MyInterestsDropdown} from "~/components/my-interests-dropdown";

export function MatchingBegin() {
    return(
        <>
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 lg:mt-10 container mx-auto gap-4 px-2 md:px-0">
                    <div className="text-center mb-4 md:mb-0">
                        <img src="../../public/commonality-logo.png" alt="Commonality Logo" className="w-1/2 md:w-1/4 mx-auto"/>
                        <h2 className="text-2xl md:text-4xl my-2 md:my-3">Let's Get Started!</h2>
                        <p className="text-base md:text-xl text-gray-900 mx-2 md:mx-10">Pick an interest from your profile to see other users with the same interest.</p>
                        <hr className="mt-6 md:mt-10 lg:mb-10 w-3/5 mx-auto"/>
                        <p className="hidden lg:block text-base md:text-xl text-gray-900 mb-2 font-bold">Want to start a new group instead?</p>
                    </div>
                    <div className="text-center content-center">
                        <h2 className="text-xl md:text-3xl lg:text-4xl my-3 md:my-5 lg:my-10">Find People Interested In:</h2>
                        <MyInterestsDropdown />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 mt-4 md:mt-5 lg:mt-0 container mx-auto gap-3 px-2 md:px-0">
                    <button className="bg-gray-900 text-gray-200 border-1 border-gray-200 rounded-xl py-2 md:py-3 px-4 md:px-6 w-full md:w-3/4 mx-auto lg:order-2">Begin Matching</button>
                    <p className="lg:hidden text-base md:text-xl text-gray-900 mb-2 mt-2 md:mt-4 font-bold text-center">Want to start a group instead?</p>
                    <button className="bg-gray-200 text-gray-900 border-1 border-gray-900 rounded-xl py-2 md:py-3 px-4 md:px-6 w-full md:w-3/4 mx-auto lg:order-1">Create a Group</button>
                </div>
            </div>
        </>
    )
}