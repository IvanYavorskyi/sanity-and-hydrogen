import { createClient } from '@sanity/client';

export function getSanityClient({
  projectId,
  dataset,
  token,
  useCdn,
}: {
  projectId: string;
  dataset: string;
  token?: string;
  useCdn: boolean;
}) {
  return createClient({
    projectId,
    dataset,
    apiVersion: '2025-06-19',
    token,
    useCdn,
  });
}
