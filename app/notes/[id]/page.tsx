import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { getNoteHubClient } from '@/lib/api/server';
import { noteKey } from '@/lib/queries';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  const queryKey = noteKey(id);
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: ({ signal }) => fetchNoteById(id, signal, getNoteHubClient()),
  });

  if (queryClient.getQueryState(queryKey)?.status === 'error') {
    throw new Error('The NoteHub API did not return this note.');
  }

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </main>
  );
}
