import {useState, useRef, useEffect} from 'react'
import 'flowbite'
import {FaPlus} from "react-icons/fa"
import {FaSearch} from "react-icons/fa"
import {CiCircleInfo} from "react-icons/ci"
import {BsFillSendFill} from "react-icons/bs"
import MessageBubble from "./components/MessageBubble"


const MessagingApp = () => {
    const [selectedChat, setSelectedChat] = useState(0);
    const [newMessage, setNewMessage] = useState('');

    const contacts = [
        {
            id: 1,
            name: 'Marcus Rodriguez',
            lastMessage: 'That\'s so fetch!',
            time: '11:30 PM',
            avatar: '',
            online: true,
            unread: 2
        },
        {
            id: 2,
            name: 'Lisa Chen',
            lastMessage: 'I can\'t believe he said that at the last meetup!',
            time: '1:15 PM',
            avatar: '',
            online: true,
            unread: 829
        },
        {
            id: 3,
            name: 'David Park',
            lastMessage: 'See you tomorrow for the meet!',
            time: '8:45 PM',
            avatar: '',
            online: false,
            unread: 1
        },
        {
            id: 4,
            name: 'Alex Thompson',
            lastMessage: 'Perfect, let me know',
            time: 'Yesterday',
            avatar: '',
            online: false,
            unread: 4
        },
        {
            id: 5,
            name: 'Sarah Mitchell',
            lastMessage: 'The project looks great!',
            time: 'Yesterday',
            avatar: '',
            online: true,
            unread: 0
        },
    ];

    const messages : boolean = [
        {id: 1, text: 'Hey! What up?!?!', sent: false, time: '2:25 PM'},
        {
            id: 2,
            text: 'I\'m doing great! Just working on some new projects. How about you?',
            sent: true,
            time: '2:26 PM'
        },
        {id: 3, text: 'I\'m ok... "Working 9-5!" as the kids say.', sent: false, time: '2:28 PM'},
        {
            id: 4,
            text: 'Awwh! Well you need a destress! We should grab coffee this week and I can tell you all about my day.',
            sent: true,
            time: '2:29 PM'
        },
        {id: 5, text: 'Perfect! How about Thursday afternoon?', sent: false, time: '2:30 PM'},
    ];

    const messageHandler = () => {
        if (newMessage.trim()) {
            setNewMessage('');
        }
    }

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            messageHandler()
        }
    }


    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <FaPlus size={20} className="text-gray-600"/>
                            </button>
                            <button type="button" data-dropdown-toggle="language-dropdown-menu"
                                    className="inline-flex items-center font-medium justify-center px-4 py-2 text-sm bg-gray-300  onClick-bg-gray 400 text-gray-900 rounded-lg cursor-pointer hover:bg-gray-200">
                                <svg className="w-5 h-5 rounded-full me-3" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink"
                                     viewBox="0 0 3900 3900">
                                    <path fill="#b22234" d="M0 0h7410v3900H0z"/>
                                    <path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff"
                                          stroke-width="300"/>
                                    <path fill="#3c3b6e" d="M0 0h2964v2100H0z"/>
                                    <g fill="#fff">
                                        <g id="d">
                                            <g id="c">
                                                <g id="e">
                                                    <g id="b">
                                                        <path id="a"
                                                              d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"/>
                                                        <use href="#a" y="420"/>
                                                        <use href="#a" y="840"/>
                                                        <use href="#a" y="1260"/>
                                                    </g>
                                                    <use href="#a" y="1680"/>
                                                </g>
                                                <use href="#b" x="247" y="210"/>
                                            </g>
                                            <use href="#c" x="494"/>
                                        </g>
                                        <use href="#d" x="988"/>
                                        <use href="#c" x="1976"/>
                                        <use href="#e" x="2470"/>
                                    </g>
                                </svg>
                                Individual
                            </button>
                            {/*Dropdown*/}
                            <div
                                className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700"
                                id="language-dropdown-menu">
                                <ul className="py-2 font-medium" role="none">
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                           role="menuitem">
                                            <div className="inline-flex items-center">
                                                <svg aria-hidden="true" className="h-3.5 w-3.5 rounded-full me-2"
                                                     xmlns="<http://www.w3.org/2000/svg>" id="flag-icon-css-us"
                                                     viewBox="0 0 512 512">
                                                    <g fill-rule="evenodd">
                                                        <g stroke-width="1pt">
                                                            <path fill="#bd3d44"
                                                                  d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                                                                  transform="scale(3.9385)"/>
                                                            <path fill="#fff"
                                                                  d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                                                                  transform="scale(3.9385)"/>
                                                        </g>
                                                        <path fill="#192f5d" d="M0 0h98.8v70H0z"
                                                              transform="scale(3.9385)"/>
                                                        <path fill="#fff"
                                                              d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z"
                                                              transform="scale(3.9385)"/>
                                                    </g>
                                                </svg>
                                                individual
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                           role="menuitem">
                                            <div className="inline-flex items-center">
                                                <svg className="h-3.5 w-3.5 rounded-full me-2" aria-hidden="true"
                                                     xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-de"
                                                     viewBox="0 0 512 512">
                                                    <path fill="#ffce00" d="M0 341.3h512V512H0z"/>
                                                    <path d="M0 0h512v170.7H0z"/>
                                                    <path fill="#d00" d="M0 170.7h512v170.6H0z"/>
                                                </svg>
                                                groups
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#"
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                           role="menuitem">
                                            <div className="inline-flex items-center">
                                                <svg className="h-3.5 w-3.5 rounded-full me-2" aria-hidden="true"
                                                     xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-it"
                                                     viewBox="0 0 512 512">
                                                    <g fill-rule="evenodd" stroke-width="1pt">
                                                        <path fill="#fff" d="M0 0h512v512H0z"/>
                                                        <path fill="#009246" d="M0 0h170.7v512H0z"/>
                                                        <path fill="#ce2b37" d="M341.3 0H512v512H341.3z"/>
                                                    </g>
                                                </svg>
                                                Individuals + Groups
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <nav className=""></nav>
                            <button className="p-2 hover:bg-gray-100 rounded-full">
                                <FaSearch size={20} className="text-gray-600"/>
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <FaSearch size={16} className="absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search Messenger"
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {contacts.map((contact, index) => (
                        <div
                            key={contact.id}
                            onClick={() => setSelectedChat(index)}
                            className={`flex items-center p-3 hover:bg-gray-50 h-25 cursor-pointer ${
                                selectedChat === index ? 'bg-blue-50' : ''
                            }`}
                        >
                            <div className="relative">
                                <div
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl">
                                    {contact.avatar}
                                </div>
                                {contact.online && (
                                    <div
                                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg text-gray-900 truncate">{contact.name}</h3>
                                    <span className="text-xs text-gray-500">{contact.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-md text-gray-600 truncate">{contact.lastMessage}</p>
                                    {contact.unread > 0 && (
                                        <span
                                            className="bg-blue-500 text-white text-xs rounded-full px-3 py-1 min-w-5 text-center justify-center">
                      {contact.unread}
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center">
                        <div className="relative">
                            <div
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                                {contacts[selectedChat]?.avatar}
                            </div>
                            {contacts[selectedChat]?.online && (
                                <div
                                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                        <div className="ml-3">
                            <h2 className="font-semibold text-gray-900">{contacts[selectedChat]?.name}</h2>
                            <p className="text-sm text-gray-500">
                                {contacts[selectedChat]?.online ? 'Active now' : 'Active 2h ago'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <CiCircleInfo size={20} className="text-blue-500"/>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
              <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-12 max-h-32"
              />
                            <button
                                onClick={messageHandler}
                                disabled={!newMessage.trim()}
                                className={`absolute right-2 bottom-2 p-2 rounded-full ${
                                    newMessage.trim()
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <BsFillSendFill size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagingApp;