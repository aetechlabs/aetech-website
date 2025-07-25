'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface LikeButtonProps {
  slug: string;
  initialLikes?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export default function LikeButton({
  slug,
  initialLikes = 0,
  size = 'md',
  showCount = true,
  className = ''
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch initial like status
  useEffect(() => {
    if (!mounted) return;
    
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}/like`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
          setLikesCount(data.likes);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [slug, mounted]);

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${slug}/like`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikesCount(data.likes);
      } else {
        console.error('Error toggling like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg'
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`
        inline-flex items-center gap-2 rounded-lg border transition-all duration-200
        ${liked 
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' 
          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${buttonSizeClasses[size]}
        ${className}
      `}
      aria-label={liked ? 'Unlike post' : 'Like post'}
    >
      {liked ? (
        <HeartSolidIcon className={`${sizeClasses[size]} text-red-500`} />
      ) : (
        <HeartIcon className={sizeClasses[size]} />
      )}
      
      {showCount && (
        <span className="font-medium">
          {likesCount}
        </span>
      )}
    </button>
  );
}
