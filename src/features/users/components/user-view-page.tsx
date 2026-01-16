'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Cloud, Upload, X, AlertCircle } from 'lucide-react';
import {
  userProfileSchema,
  type UserProfileFormValues
} from '@/features/users/utils/validation-schema';
import { useUser } from '@clerk/nextjs';
import { RoleField } from '@/services/user/user.services';
import { UserDBWithRole } from '@/services/user/user.types';

export default function UserViewPage({
  userDataOnDB
}: {
  userDataOnDB: UserDBWithRole;
}) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(
    userDataOnDB.avatar_url
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const role = (user?.publicMetadata.role as RoleField['role']) || 'USER';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: userDataOnDB.name || '',
      role: userDataOnDB.role
    }
  });
  const isAdmin = role === 'ADMIN';

  const name = watch('name');

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
      processImageFile(files[0]);
    }
  };

  const processImageFile = (file: File) => {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      alert('File size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setImageFile(null);
    };
    reader.readAsDataURL(file);
  };

  const changeImage = () => {
    console.log(fileInputRef);
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(userDataOnDB.avatar_url);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onFormSubmit = async (data: UserProfileFormValues) => {
    setIsSubmitting(true);

    try {
      if (imageFile) {
        await uploadAvatar(imageFile);
      }
      await updateUserProfile(data);
      toast.success('Update profile successfully!');
    } catch (e) {
      toast.error(`Error: ${e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  type UploadAvatarResponse = {
    url: string;
  };

  async function uploadAvatar(
    file: File
  ): Promise<UploadAvatarResponse['url']> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`/api/users/${userDataOnDB.id}/image`, {
      method: 'PATCH',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Avatar upload failed');
    }

    const data = (await res.json()) as UploadAvatarResponse;
    return data.url;
  }

  type UpdateProfileResponse = {
    message: string;
  };

  async function updateUserProfile(
    data: UserProfileFormValues
  ): Promise<UpdateProfileResponse['message']> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('role', data.role);
    const res = await fetch(`/api/users/${userDataOnDB.id}`, {
      method: 'PATCH',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Profile update failed.');
    }

    const dataRes = (await res.json()) as UpdateProfileResponse;
    const message = dataRes.message;
    return message;
  }

  return (
    <main className='bg-background min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto w-full'>
        {/* Main Card */}
        <Card className='border shadow-lg'>
          <CardHeader className='space-y-1 border-b'>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information below
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-8'>
            <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-8'>
              {/* Image Upload Section */}
              <div className='space-y-3'>
                <div>
                  <Label className='text-base font-semibold'>
                    Profile Picture
                  </Label>
                  <p className='text-muted-foreground text-sm'>
                    JPG, PNG or GIF (max. 5MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  className='hidden'
                />

                {imagePreview ? (
                  <div className='border-border bg-muted/30 flex flex-col items-center gap-4 rounded-lg border p-8'>
                    <Avatar className='h-32 w-32'>
                      <AvatarImage
                        src={imagePreview || '/placeholder.svg'}
                        alt='Preview'
                        className='object-cover'
                      />
                      <AvatarFallback>
                        {name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex gap-2 hover:cursor-pointer'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={changeImage}
                        className='gap-2 bg-transparent'
                      >
                        <Upload className='h-4 w-4' />
                        Change Image
                      </Button>

                      {imageFile && (
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={clearImage}
                          className='text-destructive hover:bg-destructive/10'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 transition-colors ${
                      isDragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Cloud className='text-muted-foreground h-12 w-12' />
                    <div className='text-center'>
                      <p className='text-base font-medium'>
                        Drag & drop your image here
                      </p>
                      <p className='text-muted-foreground text-sm'>or</p>
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => fileInputRef.current?.click()}
                      className='gap-2'
                    >
                      <Upload className='h-4 w-4' />
                      Select Image
                    </Button>
                  </div>
                )}
                {errors.image && (
                  <div className='bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-sm'>
                    <AlertCircle className='h-4 w-4 flex-shrink-0' />
                    <span>{String(errors.image.message)}</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className='border-border border-t' />

              {/* Name Field */}
              <div className='space-y-2'>
                <Label htmlFor='name' className='text-base font-semibold'>
                  Full Name
                </Label>
                <Input
                  id='name'
                  {...register('name')}
                  placeholder='Enter your full name'
                  className={`rounded-md text-base ${errors.name ? 'border-destructive' : ''}`}
                />
                {errors.name && (
                  <p className='text-destructive flex items-center gap-2 text-sm'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div className='space-y-2'>
                <div>
                  <Label htmlFor='role' className='text-base font-semibold'>
                    Role
                  </Label>
                  {!isAdmin && (
                    <p className='text-muted-foreground text-sm'>
                      Only admins can change the role
                    </p>
                  )}
                </div>
                <Select
                  disabled={!isAdmin}
                  value={watch('role')}
                  onValueChange={(value) =>
                    setValue('role', value as 'USER' | 'ADMIN')
                  }
                >
                  <SelectTrigger
                    id='role'
                    className={`rounded-md text-base ${!isAdmin ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value='USER'>User</SelectItem>
                    <SelectItem value='ADMIN'>Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className='text-destructive flex items-center gap-2 text-sm'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className='border-border border-t' />

              {/* Action Buttons */}
              <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.back()}
                  className='sm:w-auto'
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='hover:cursor-pointer sm:w-auto'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
