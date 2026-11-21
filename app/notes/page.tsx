import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { connection } from 'next/server';
import { fetchNotes } from '@/lib/api';
import { getNoteHubClient } from '@/lib/api/server';
import { notesKey } from '@/lib/queries';
import NotesClient from './Notes.client';

export default async function NotesPage() {
  await connection();
  const queryClient = new QueryClient();
  const queryKey = notesKey('', 1);
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: ({ signal }) =>
      fetchNotes({ search: '', page: 1, signal }, getNoteHubClient()),
  });

  if (queryClient.getQueryState(queryKey)?.status === 'error') {
    throw new Error('The NoteHub API did not return the list.');
  }

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient />
      </HydrationBoundary>
    </main>
  );
}
