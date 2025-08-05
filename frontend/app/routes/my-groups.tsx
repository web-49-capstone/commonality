import { getGroupsByUserId } from "~/utils/loaders/group-loader";
import { FaUserGroup } from "react-icons/fa6";
import type {Route} from "../../.react-router/types/app/+types/root";

export async function loader({request}: Route.LoaderArgs) {
    return await getGroupsByUserId(request);
}

export default function MyGroups({ loaderData }: Route.ComponentProps) {
    const { groups, user } = loaderData;


    return (
        <section className="max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <FaUserGroup className="h-10 w-10 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <div key={group.groupId} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                            <div className="flex items-start mb-4">
                                <img
                                    src={'/commonality-logo.png'} // Replace with actual group image once available
                                    alt={group.groupName}
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">{group.groupName}</h3>
                                    <div className="flex items-center mt-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm font-medium text-gray-700">{group.groupSize} members</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 flex-1">
                                <p className="text-gray-600 mb-2">{group.groupDescription}</p>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <a
                                    href={`/groups/${group.groupId}`}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-full font-medium hover:bg-blue-700 transition-colors text-center"
                                >
                                    View Group
                                </a>
                                {group.groupAdminUserId === user.userId && (
                                    <a
                                        href={`/groups/${group.groupId}/edit`}
                                        className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Edit
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">You are not a member of any groups yet.</div>
                )}
            </div>
        </section>
    );
}
