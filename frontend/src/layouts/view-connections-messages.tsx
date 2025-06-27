
import { TabItem, Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import styles from "../../app/app.css"

export function Connections() {
    return (
        <>
            <h1 className={'text-5xl font-bold flex flex-wrap justify-center'}>My Connections</h1>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap justify-center -mb mt-15 -px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <li className="me-2">
                        <a href="#"
                           className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                            <svg
                                className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                            </svg>
                            Individual
                        </a>
                    </li>
                    <li className="me-2">
                        <a href="#"
                           className="inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group"
                           aria-current="page">
                            <svg className="w-4 h-4 me-2 text-blue-600 dark:text-blue-500" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                <path
                                    d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                            </svg>
                            Groups
                        </a>
                    </li>
                    <li className="me-2">
                        <a href="#"
                           className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                            <svg
                                className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z"/>
                            </svg>
                            Recently Added
                        </a>
                    </li>
                    <li className="me-2">
                        <a href="#"
                           className="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                            <svg
                                className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                viewBox="0 0 18 20">
                                <path
                                    d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                            </svg>
                            Frequent Messages
                        </a>
                    </li>
                </ul>
            </div>

            <div className="bg-gray-200 p-8 inset-shadow-sm/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">

                {/*/DnD United Card*/}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                    <div className="flex items-start mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=60&h=60&fit=crop&crop=center"
                            alt="DnD United"
                            className="w-16 h-16 rounded-full border-3 border-solid border-gray-200 drop-shadow-xl/50 object-cover mr-4 flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">DnD United!</h3>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-900">42 members</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex-1">
                        <p className="text-sm text-gray-600 mb-2">Welcome To All Skill Levels!</p>
                        <p className="text-sm text-gray-500">Next meetup: Campaign Strategy - June 22</p>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button
                            className="${styles.container} ${styles.container:before} flex-1 bg-blue-600  text-white py-2 px-4 rounded-3xl font-medium hover:bg-blue-700 transition-colors">
                            Message
                        </button>
                        <button
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-3xl font-medium hover:bg-gray-50 transition-colors">
                            Profile
                        </button>
                    </div>
                </div>

                {/*Pocket Monsters Card*/}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                    <div className="flex items-start mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=60&h=60&fit=crop&crop=center"
                            alt="Pocket Monsters"
                            className="w-16 h-16 rounded-full border-3 border-solid border-gray-200 drop-shadow-xl/50 object-cover mr-4 flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">Pocket Monsters Portable -
                                    505</h3>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-900">35 members</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex-1">
                        <p className="text-sm text-gray-600 mb-2">Welcome To All Skill Levels!</p>
                        <p className="text-sm text-gray-500">Next meetup: Catch 'Em All! - June 15</p>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-3xl font-medium hover:bg-blue-700 transition-colors">
                            Message
                        </button>
                        <button
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-3xl font-medium hover:bg-gray-50 transition-colors">
                            Profile
                        </button>
                    </div>
                </div>

                {/*Tech Scene Card*/}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                    <div className="flex items-start mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=60&h=60&fit=crop&crop=center"
                            alt="Tech Scene"
                            className="w-16 h-16 rounded-full border-3 border-solid border-gray-200  drop-shadow-xl/50 object-cover mr-4 flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">Tech Scene 'Querque</h3>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-900">80 members</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex-1">
                        <p className="text-sm text-gray-600 mb-2">Welcome To All Skill Levels!</p>
                        <p className="text-sm text-gray-500">Next meetup: Tech & Talk & Tea! - June 28</p>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-3xl font-medium hover:bg-blue-700 transition-colors">
                            Message
                        </button>
                        <button
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-3xl font-medium hover:bg-gray-50 transition-colors">
                            Profile
                        </button>
                    </div>
                </div>

                {/*Basketball Bros Card*/}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                    <div className="flex items-start mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=60&h=60&fit=crop&crop=center"
                            alt="Basketball Bros"
                            className="w-16 h-16 rounded-full border-3 border-solid border-gray-200 drop-shadow-xl/50 object-cover mr-4 flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">Basketball Bros!</h3>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-900">35 members</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex-1">
                        <p className="text-sm text-gray-600 mb-2">Intermediate - Advanced Only</p>
                        <p className="text-sm text-gray-500">Next meetup: Slam Dunk Showoff! - June 25</p>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-3xl font-medium hover:bg-blue-700 transition-colors">
                            Message
                        </button>
                        <button
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-3xl font-medium hover:bg-gray-50 transition-colors">
                            Profile
                        </button>
                    </div>
                </div>

                {/*Badminton Pros Card*/}
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                    <div className="flex items-start mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=60&h=60&fit=crop&crop=center"
                            alt="Badminton Pros"
                            className="w-16 h-16 rounded-full border-3 border-solid border-gray-200 drop-shadow-xl/50 object-cover mr-4 flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">Badminton Pros!</h3>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-900">12 members</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 flex-1">
                        <p className="text-sm text-gray-600 mb-2">Intermediate - Advanced Only</p>
                        <p className="text-sm text-gray-500">Next meetup: See You On The Field! - July 1</p>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-3xl font-medium hover:bg-blue-700 transition-colors">
                            Message
                        </button>
                        <button
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-3xl font-medium hover:bg-gray-50 transition-colors">
                            Profile
                        </button>
                    </div>
                </div>

              </div>
            </div>
            </>
            )
            }
