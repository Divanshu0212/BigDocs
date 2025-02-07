import React, { useState } from 'react';
import { 
  Search, MessageSquare, Heart, Share2, 
  ThumbsUp, User, Filter, Clock,
  BookOpen, Bookmark, AlertCircle,
  ChevronDown, PlusCircle
} from 'lucide-react';

const CommunityForum = () => {
  const [activeTab, setActiveTab] = useState('latest');

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community Forum</h1>
            <p className="text-gray-600">Connect with others and share experiences</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Create Post
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex gap-4">
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option>All Categories</option>
                <option>General Health</option>
                <option>Mental Health</option>
                <option>Chronic Conditions</option>
                <option>Wellness & Lifestyle</option>
                <option>Success Stories</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Filter className="h-5 w-5" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b">
          <TabButton 
            active={activeTab === 'latest'}
            onClick={() => setActiveTab('latest')}
            icon={<Clock className="h-5 w-5" />}
            label="Latest"
          />
          <TabButton 
            active={activeTab === 'popular'}
            onClick={() => setActiveTab('popular')}
            icon={<ThumbsUp className="h-5 w-5" />}
            label="Popular"
          />
          <TabButton 
            active={activeTab === 'bookmarked'}
            onClick={() => setActiveTab('bookmarked')}
            icon={<Bookmark className="h-5 w-5" />}
            label="Bookmarked"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts Feed */}
          <div className="lg:col-span-2 space-y-6">
            <ForumPost
              title="Managing Anxiety During the Pandemic"
              author="Sarah Miller"
              authorRole="Community Member"
              category="Mental Health"
              content="I've been dealing with increased anxiety lately and wanted to share some coping strategies that have helped me. First, I've found that maintaining a regular meditation practice..."
              likes={128}
              comments={45}
              shares={12}
              timeAgo="2 hours ago"
              tags={['Anxiety', 'Mental Health', 'Self Care']}
            />
            <ForumPost
              title="Type 2 Diabetes Success Story"
              author="Dr. James Wilson"
              authorRole="Endocrinologist"
              category="Success Stories"
              content="After being diagnosed with Type 2 Diabetes last year, I made significant lifestyle changes. Here's what worked for me and my patients..."
              likes={256}
              comments={89}
              shares={34}
              timeAgo="5 hours ago"
              tags={['Diabetes', 'Lifestyle', 'Diet']}
              verified
            />
            <ForumPost
              title="Heart Health Q&A Session"
              author="Dr. Emily Chen"
              authorRole="Cardiologist"
              category="Expert Discussion"
              content="I'll be hosting a Q&A session about heart health and prevention strategies. Feel free to post your questions below..."
              likes={342}
              comments={167}
              shares={56}
              timeAgo="1 day ago"
              tags={['Heart Health', 'Prevention', 'Expert Advice']}
              verified
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Guidelines */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <BookOpen className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Community Guidelines</h2>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  Be respectful and supportive
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  No medical advice
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  Protect your privacy
                </li>
              </ul>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Trending Topics</h2>
              <div className="space-y-3">
                {['Mental Health', 'COVID-19', 'Exercise', 'Nutrition', 'Sleep'].map((topic) => (
                  <div key={topic} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-gray-700">{topic}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Top Contributors</h2>
              <div className="space-y-4">
                {[
                  { name: 'Dr. Sarah Johnson', role: 'Cardiologist', posts: 128 },
                  { name: 'Michael Chen', role: 'Health Coach', posts: 96 },
                  { name: 'Emily Brown', role: 'Nutritionist', posts: 84 }
                ].map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    <span className="text-sm text-gray-500">{member.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
      active 
        ? 'border-blue-600 text-blue-600' 
        : 'border-transparent text-gray-600 hover:text-blue-600'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const ForumPost = ({ 
  title, 
  author, 
  authorRole,
  category, 
  content, 
  likes, 
  comments, 
  shares, 
  timeAgo,
  tags,
  verified = false
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-start justify-between">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-600">{author}</span>
            {verified && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                Verified
              </span>
            )}
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">{authorRole}</span>
          </div>
        </div>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
        {category}
      </span>
    </div>
    
    <p className="mt-4 text-gray-600">{content}</p>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag) => (
        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
          #{tag}
        </span>
      ))}
    </div>
    
    <div className="flex items-center justify-between mt-4 pt-4 border-t">
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <ThumbsUp className="h-5 w-5" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <MessageSquare className="h-5 w-5" />
          <span>{comments}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Share2 className="h-5 w-5" />
          <span>{shares}</span>
        </button>
      </div>
      <span className="text-sm text-gray-500">{timeAgo}</span>
    </div>
  </div>
);

export default CommunityForum;