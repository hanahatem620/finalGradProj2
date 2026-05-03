'use client'
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { IoMdHeart } from "react-icons/io";
import { toast } from 'sonner';

interface Props {
  artistId: number;
  onRemove?: () => void;
  initialFav?: boolean
}

export default function FavouriteBtn({artistId, onRemove, initialFav=false} : Props) {

  const [isFav, setIsFav] = useState(initialFav);

async function toggleFav() {
  const method = isFav ? 'DELETE' : 'POST';

  const res = await fetch('/api/favorites', {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ artist_id: artistId }),
  });

  if (!res.ok) return;

  setIsFav(!isFav); // ✅ toggle فوري

  if (method === 'DELETE') {
    toast.success('Removed from favorites',{
      position: 'top-center',
      duration:2000
    });

    // 👇 مهم جدًا
    onRemove?.();
  } else {
    toast.success('Added to favorites',{
      position:"top-center",
      duration:2000
    });
  }
}


 useEffect(() => {
    setIsFav(initialFav);
  }, [initialFav, artistId]);


  return (
    <Button
      onClick={toggleFav}
      variant="ghost"
      className='absolute top-3 left-3'>
       {isFav ? (
    <IoMdHeart className="text-4xl text-red-500" />
  ) : (
    <CiHeart className="text-4xl text-red-500" />
  )}
    </Button>
  );
}