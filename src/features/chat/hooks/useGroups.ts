import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Group {
  id: string;
  name: string;
  description?: string;
  courseId: string;
  _count?: {
    members: number;
    messages: number;
  };
  members?: Array<{
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
}

interface CreateGroupData {
  name: string;
  description?: string;
  courseId: string;
}

interface UpdateGroupData {
  name?: string;
  description?: string;
}

interface AddMemberData {
  userId: string;
  role?: 'OWNER' | 'ADMIN' | 'MEMBER';
}

async function fetchCourseGroups(courseId: string) {
  const response = await fetch(`/api/courses/${courseId}/groups`);

  if (!response.ok) {
    throw new Error('Failed to fetch groups');
  }

  return response.json();
}

async function fetchGroup(groupId: string) {
  const response = await fetch(`/api/groups/${groupId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch group');
  }

  return response.json();
}

async function createGroup(data: CreateGroupData) {
  const response = await fetch('/api/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create group');
  }

  return response.json();
}

async function updateGroup(groupId: string, data: UpdateGroupData) {
  const response = await fetch(`/api/groups/${groupId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update group');
  }

  return response.json();
}

async function addMember(groupId: string, data: AddMemberData) {
  const response = await fetch(`/api/groups/${groupId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to add member');
  }

  return response.json();
}

async function removeMember(groupId: string, userId: string) {
  const response = await fetch(`/api/groups/${groupId}/members/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to remove member');
  }

  return response.json();
}

export function useCourseGroups(courseId: string) {
  return useQuery({
    queryKey: ['groups', 'course', courseId],
    queryFn: () => fetchCourseGroups(courseId),
    enabled: !!courseId,
  });
}

export function useGroup(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId],
    queryFn: () => fetchGroup(groupId),
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      toast.success('Group created successfully');
      queryClient.invalidateQueries({ queryKey: ['groups', 'course', data.courseId] });
    },
    onError: () => {
      toast.error('Failed to create group');
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: UpdateGroupData }) =>
      updateGroup(groupId, data),
    onSuccess: (data) => {
      toast.success('Group updated successfully');
      queryClient.invalidateQueries({ queryKey: ['groups', data.id] });
      queryClient.invalidateQueries({ queryKey: ['groups', 'course'] });
    },
    onError: () => {
      toast.error('Failed to update group');
    },
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: AddMemberData }) =>
      addMember(groupId, data),
    onSuccess: (_, { groupId }) => {
      toast.success('Member added successfully');
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
    },
    onError: () => {
      toast.error('Failed to add member');
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      removeMember(groupId, userId),
    onSuccess: (_, { groupId }) => {
      toast.success('Member removed successfully');
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
    },
    onError: () => {
      toast.error('Failed to remove member');
    },
  });
} 