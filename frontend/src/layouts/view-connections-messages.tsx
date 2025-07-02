import {useState} from 'react'
import { FaUserGroup } from "react-icons/fa6";

interface Profile {
    id: string;
    name: string,
    image: string | any,
    memberCount: number,
    description: string,
    nextMeetup: string,
    skillLevel: string,
    isIndividual: boolean,
    isOnline: boolean | null
}
//I'M WORKING ON THE MESSAGING ASPECT!!! SEE "handleMessagesClick"
const groupProfiles: Profile[] = [
    {
        id: "1",
        name: "DnD United!",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=60&h=60&fit=crop&crop=center",
        memberCount: 42,
        description: "Welcome To All Skill Levels!",
        nextMeetup: "Campaign Strategy - June 22",
        skillLevel: "All Levels",
        isIndividual: false,
        isOnline: null
    },
    {
        id: "2",
        name: "Pocket Monsters Portable - 505",
        image: "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=60&h=60&fit=crop&crop=center",
        memberCount: 35,
        description: "Welcome To All Skill Levels!",
        nextMeetup: "Catch 'Em All! - June 15",
        skillLevel: "All Levels",
        isIndividual: false,
        isOnline: null
    },
    {
        id: "3",
        name: "Tech Scene 'Querque",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=60&h=60&fit=crop&crop=center",
        memberCount: 80,
        description: "Welcome To All Skill Levels!",
        nextMeetup: "Tech & Talk & Tea! - June 28",
        skillLevel: "All Levels",
        isIndividual: false,
        isOnline: null
    },
    {
        id: "4",
        name: "Basketball Bros!",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=60&h=60&fit=crop&crop=center",
        memberCount: 35,
        description: "Intermediate - Advanced Only",
        nextMeetup: "Slam Dunk Showoff! - June 25",
        skillLevel: "Intermediate - Advanced",
        isIndividual: false,
        isOnline: null
    },
    {
        id: "5",
        name: "Badminton Pros!",
        image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=60&h=60&fit=crop&crop=center",
        memberCount: 12,
        description: "Intermediate - Advanced Only",
        nextMeetup: "See You On The Field! - July 1",
        skillLevel: "Intermediate - Advanced",
        isIndividual: false,
        isOnline: null
    }
]

const individualProfiles : Profile[] = [
    {
        id: "ind1",
        name: "Sarah Mitchell",
        image: "https://source.unsplash.com/9UMmYe",
        memberCount: 0,
        description: "Software Engineer & D&D Enthusiast",
        nextMeetup: "Coffee Chat - June 30",
        skillLevel: "Intermediate",
        isIndividual: true,
        isOnline: false
    },
    {
        id: "ind2",
        name: "Marcus Rodriguez",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=center",
        memberCount: 0,
        description: "Basketball Coach & Mentor",
        nextMeetup: "Training Session - July 2",
        skillLevel: "Advanced",
        isIndividual: true,
        isOnline: true
    },
    {
        id: "ind3",
        name: "Lisa Chen",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=center",
        memberCount: 0,
        description: "Tech Startup Founder",
        nextMeetup: "Networking Event - June 29",
        skillLevel: "Expert",
        isIndividual: true,
        isOnline: true
    },
    {
        id: "ind4",
        name: "David Park",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=center",
        memberCount: 0,
        description: "Professional Badminton Player",
        nextMeetup: "Practice Match - July 3",
        skillLevel: "Professional",
        isIndividual: true,
        isOnline: false
    },
]


type TabType = 'individual' | 'groups' | 'recent' | 'Messages';

export function Connections() {
    const [activeTab, setActiveTab] = useState<TabType>('individual');

    // Get profiles based on active tab
    const getActiveProfiles = (): Profile[] => {
        switch (activeTab) {
            case 'individual':
                return individualProfiles;
            case 'groups':
                return groupProfiles;
            case 'recent':
                return groupProfiles;
            case 'Messages':
                return []
            default:
                return groupProfiles;
        }
    };


    return (
        <>
            <section className="mt-25">
            <div className="flex items-center justify-center gap-4 mt-25">
                <h1 className={'text-5xl font-bold'}>My Connections</h1>
                <FaUserGroup className={'h-15 w-15 text-blue-600'}/>
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap justify-center -mb mt-15 -px text-sm font-medium text-center text-gray-500">
                    <li className="me-2">
                        <button
                            onClick={() => setActiveTab('individual')}
                            className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                                activeTab === 'individual' ? 'text-blue-600 border-blue-600 active' : ''}`}>
                            <svg
                                className={`w-5 h-5 me-2 ${
                                    activeTab === 'individual'
                                        ? 'text-blue-600'
                                        : 'text-gray-400 group-hover:text-gray-500'
                                }`}
                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                            </svg>
                            Individual
                        </button>
                    </li>
                    <li className="me-2">
                        <button
                            onClick={() => setActiveTab('groups')}
                            className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-300 hover:border-gray-300 ${
                                activeTab === 'groups' ? 'text-blue-600 active border-blue-600 active' : ''
                           }`}>
                            <svg className={`w-4 h-4 me-2 ${
                                activeTab === 'groups'
                                    ? 'text-blue-600 dark:text-blue-500'
                                    : 'text-gray-400 group-hover:text-gray-500'
                            }`} aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                <path
                                    d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                            </svg>
                            Groups
                        </button>
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
                        <button
                            onClick={() => setActiveTab('Messages')}
                            className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                                activeTab === 'Messages' ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500' : ''
                            }`}>
                            <svg
                                className={`w-4 h-4 me-2 ${
                                    activeTab === 'Messages'
                                        ? 'text-blue-600 dark:text-blue-500'
                                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                                }`}
                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                viewBox="0 0 18 20">
                                <path
                                    d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                            </svg>
                            Messages
                        </button>
                    </li>
                </ul>
            </div>

            <div className="bg-gray-200 p-8 inset-shadow-sm/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">

                    {getActiveProfiles().map((profile) => (
                        <div key={profile.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                            <div className="flex items-start mb-4">
                                <img
                                    src={profile.image}
                                    alt={profile.name}
                                    className="w-19 h-19 rounded-full border-3 border-solid border-gray-200 drop-shadow-xl/50 object-cover mr-4 flex-shrink-0"/>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">{profile.name}</h3>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    {!profile.isIndividual && profile.memberCount && (
                                        <div className="flex items-center mb-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            <span className="text-sm font-medium text-gray-900">{profile.memberCount} members</span>
                                        </div>
                                    )}
                                    {profile.isIndividual && profile.isOnline && (
                                        <div className="flex items-center mb-1">
                                            <div className="w-3 h-3 animate-ping bg-green-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full -ml-3 mr-2"></div>
                                            <span className="text-sm font-medium text-gray-900">{profile.isOnline} is online</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4 flex-1">
                                <p className="text-18 text-gray-600 mb-2">{profile.description}</p>
                                <p className="text-18 text-gray-500">Next meetup: {profile.nextMeetup}</p>
                            </div>

                            <div className="flex gap-3 mt-auto">
                                <button
                                    className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-3xl font-medium hover:bg-blue-700 transition-colors'>
                                    {profile.isIndividual ? 'Connect' : 'Message'}
                                </button>
                                <button
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-3xl font-medium hover:bg-gray-50 transition-colors">
                                    Profile
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
          </section>
        </>
    )
}