'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Cloud, Upload, X } from 'lucide-react';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
  onSubmit: (data: { name: string; role: string; image?: File }) => void;
  defaultValues?: {
    name: string;
    role: string;
    image?: string;
  };
}

export function UserProfileModal({
  open,
  onOpenChange,
  isAdmin,
  onSubmit,
  defaultValues
}: UserProfileModalProps) {
  const [name, setName] = useState(defaultValues?.name || '');
  const [role, setRole] = useState(defaultValues?.role || 'USER');
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.image || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processImageFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processImageFile(file);
      }
    }
  };
  const processImageFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.onerror = () => {
      setImageFile(null);
      setImagePreview(null);
      // Optionally show error toast/message to user
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      role,
      image: imageFile || undefined
    });
    // Reset form
    setName(defaultValues?.name || '');
    setRole(defaultValues?.role || 'USER');
    setImagePreview(defaultValues?.image || null);
    setImageFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-md rounded-lg p-4 sm:p-6'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Update Profile
          </DialogTitle>
          <DialogDescription>
            Update your profile information and avatar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Image Upload Section */}
          <div className='space-y-3'>
            <Label className='text-sm font-medium'>Profile Picture</Label>

            {imagePreview ? (
              <div className='flex flex-col items-center gap-3'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage
                    src={imagePreview || '/placeholder.svg'}
                    alt='Preview'
                  />
                  <AvatarFallback>
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={clearImage}
                  className='gap-2 bg-transparent'
                >
                  <X className='h-4 w-4' />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Cloud className='text-muted-foreground h-8 w-8' />
                <div className='text-center'>
                  <p className='text-sm font-medium'>
                    Drag & drop your image here
                  </p>
                  <p className='text-muted-foreground text-xs'>or</p>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => fileInputRef.current?.click()}
                  className='gap-2'
                >
                  <Upload className='h-4 w-4' />
                  Select Image
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  className='hidden'
                />
              </div>
            )}
          </div>

          {/* Name Field */}
          <div className='space-y-2'>
            <Label htmlFor='name' className='text-sm font-medium'>
              Name
            </Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter your name'
              className='rounded-md'
              required
            />
          </div>

          {/* Role Field */}
          <div className='space-y-2'>
            <Label htmlFor='role' className='text-sm font-medium'>
              Role
            </Label>
            <Select value={role} onValueChange={setRole} disabled={!isAdmin}>
              <SelectTrigger
                id='role'
                className={`rounded-md ${!isAdmin ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='USER'>User</SelectItem>
                <SelectItem value='ADMIN'>Admin</SelectItem>
              </SelectContent>
            </Select>
            {!isAdmin && (
              <p className='text-muted-foreground text-xs'>
                Only admins can change the role
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button type='submit' className='flex-1'>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
