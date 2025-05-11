import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

const AllSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Dummy data for sessions
    const dummyData = [
        {
            _id: '1',
            title: 'Calculus Support Session',
            subject: 'Mathematics',
            status: 'pending',
            requestor: { name: 'John Doe', email: 'john@example.com' },
            sessionDate: '2023-11-30T10:00:00Z',
            startTime: '10:00 AM',
            endTime: '11:00 AM',
            createdAt: '2023-11-25T08:30:00Z',
            description: 'Need help with differential equations'
        },
        {
            _id: '2',
            title: 'Physics Problem Solving',
            subject: 'Physics',
            status: 'pending',
            requestor: { name: 'Sarah Smith', email: 'sarah@example.com' },
            sessionDate: '2023-12-02T14:00:00Z',
            startTime: '2:00 PM',
            endTime: '3:00 PM',
            createdAt: '2023-11-26T11:45:00Z',
            description: 'Need assistance with mechanics problems'
        },
        {
            _id: '3',
            title: 'Programming in Python',
            subject: 'Computer Science',
            status: 'pending',
            requestor: { name: 'Mike Johnson', email: 'mike@example.com' },
            sessionDate: '2023-12-05T16:30:00Z',
            startTime: '4:30 PM',
            endTime: '5:30 PM',
            createdAt: '2023-11-27T09:15:00Z',
            description: 'Help with object-oriented programming concepts'
        }
    ];

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = () => {
        // Simulate API loading time
        setTimeout(() => {
            setSessions(dummyData);
            setLoading(false);
        }, 1000);
    };

    const handleAccept = async (sessionId) => {
        // Simulate API call
        setTimeout(() => {
            setSessions(sessions.map(session => 
                session._id === sessionId ? { ...session, status: 'accepted' } : session
            ));
            toast.success('Session accepted successfully');
        }, 500);
    };

    const handleReject = async (sessionId) => {
        // Simulate API call
        setTimeout(() => {
            setSessions(sessions.map(session => 
                session._id === sessionId ? { ...session, status: 'rejected' } : session
            ));
            toast.success('Session rejected');
        }, 500);
    };

    const handleViewDetails = (sessionId) => {
        navigate(`/sessions/${sessionId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Session Requests</h1>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Session Requests</h1>
                    <div className="bg-red-100 p-4 rounded-md text-red-700">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Session Requests</h1>
                
                {sessions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        No session requests available at the moment.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {sessions.map((session) => (
                            <div key={session._id} className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold">{session.title}</h3>
                                            <p className="text-gray-600">{session.subject}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {session.status}
                                        </span>
                                    </div>
                                    
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">From:</span> {session.requestor.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Date:</span> {new Date(session.sessionDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">Time:</span> {session.startTime} - {session.endTime}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            <span className="font-medium">Requested:</span> {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={() => handleViewDetails(session._id)}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleAccept(session._id)}
                                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleReject(session._id)}
                                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllSessions;