'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { BuilderShell } from '@/components/resume/BuilderShell';
import { resumeAPI } from '@/lib/api';
import { createEmptyResume, getErrorMessage } from '@/lib/utils';
import { useResumeStore } from '@/store/resume.store';
import type { Resume } from '@/types/resume';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  const hasRequestedNewResume = useRef(false);

  const { currentResume, setResume, updateResume, isDirty, setSaving, markClean, resetResume } = useResumeStore();

  const resumeQuery = useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumeAPI.getById(id).then((response) => response.data.data.resume as Resume),
    enabled: !isNew,
  });

  useEffect(() => {
    if (resumeQuery.data) {
      setResume(resumeQuery.data);
    }
  }, [resumeQuery.data, setResume]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Resume>) => resumeAPI.create(data),
    onSuccess: (response) => {
      const created = response.data.data.resume as Resume;
      setResume(created);
      markClean();
      router.replace(`/dashboard/builder/${created._id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const saveMutation = useMutation({
    mutationFn: ({ resumeId, data }: { resumeId: string; data: Partial<Resume> }) =>
      resumeAPI.update(resumeId, data),
    onSuccess: (response) => {
      setResume(response.data.data.resume as Resume);
      markClean();
      setSaving(false);
    },
    onError: (error) => {
      setSaving(false);
      toast.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    resetResume();
  }, [id, resetResume]);

  useEffect(() => {
    if (!isNew || hasRequestedNewResume.current) {
      return;
    }

    hasRequestedNewResume.current = true;
    createMutation.mutate(createEmptyResume() as Partial<Resume>);
  }, [createMutation, isNew]);

  useEffect(() => {
    if (!currentResume?._id || !isDirty || createMutation.isPending) {
      return;
    }

    const timeout = setTimeout(() => {
      setSaving(true);
      saveMutation.mutate({ resumeId: currentResume._id, data: currentResume });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [createMutation.isPending, currentResume, isDirty, saveMutation, setSaving]);

  const handleManualSave = () => {
    if (!currentResume?._id) {
      return;
    }

    setSaving(true);
    saveMutation.mutate(
      { resumeId: currentResume._id, data: currentResume },
      { onSuccess: () => toast.success('Resume saved.') }
    );
  };

  if (resumeQuery.isLoading || createMutation.isPending || (!currentResume && !isNew)) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (resumeQuery.isError) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="card p-10 text-center max-w-sm">
          <p className="text-red-400 font-medium mb-2">Resume not found</p>
          <p className="text-slate-500 text-sm mb-6">
            This resume may have been deleted or you may not have access to it.
          </p>
          <button onClick={() => router.push('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentResume) {
    return null;
  }

  return <BuilderShell resume={currentResume} onUpdate={updateResume} onSave={handleManualSave} />;
}
