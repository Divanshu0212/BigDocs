import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase"; // Ensure Firebase is correctly imported
import {
  collection,
  query,
  orderBy,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  Search,
  MessageSquare,
  Heart,
  Share2,
  ThumbsUp,
  User,
  PlusCircle,
} from "lucide-react";

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  // Fetch user role and posts
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user role from Firestore
        const userDoc = await getDocs(query(collection(db, "users")));
        userDoc.forEach((doc) => {
          if (doc.id === user.uid) setRole(doc.data().role);
        });

        // Fetch and listen to posts
        const postsQuery = query(collection(db, "posts"), orderBy("likes", "desc"));
        const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
          setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });

        return () => unsubscribePosts();
      } else {
        setRole(null);
        setPosts([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Handle post creation
  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return;
    await addDoc(collection(db, "posts"), {
      title: newPost.title,
      content: newPost.content,
      author: auth.currentUser.displayName || "Unknown",
      authorId: auth.currentUser.uid,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
    });
    setNewPost({ title: "", content: "" });
  };

  // Handle liking a post
  const handleLikePost = async (postId, currentLikes) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { likes: currentLikes + 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Community Forum</h1>
          {role === "doctor" && (
            <button
              onClick={handleCreatePost}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Create Post
            </button>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Post Creation Form (Doctors Only) */}
        {role === "doctor" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <input
              type="text"
              placeholder="Post title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full p-2 border rounded-lg mb-2"
            />
            <textarea
              placeholder="Write your post here..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full p-2 border rounded-lg mb-2"
            />
            <button
              onClick={handleCreatePost}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <ForumPost key={post.id} post={post} onLike={handleLikePost} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ForumPost = ({ post, onLike }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-lg">{post.title}</h3>
        <p className="text-gray-600 text-sm">By {post.author}</p>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
        {post.likes} Likes
      </span>
    </div>

    <p className="mt-4 text-gray-600">{post.content}</p>

    {/* Actions */}
    <div className="flex items-center justify-between mt-4 pt-4 border-t">
      <button
        onClick={() => onLike(post.id, post.likes)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <ThumbsUp className="h-5 w-5" />
        <span>{post.likes}</span>
      </button>
      <div className="flex gap-4">
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <MessageSquare className="h-5 w-5" />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
          <Share2 className="h-5 w-5" />
          <span>{post.shares}</span>
        </button>
      </div>
    </div>
  </div>
);

export default CommunityForum;
