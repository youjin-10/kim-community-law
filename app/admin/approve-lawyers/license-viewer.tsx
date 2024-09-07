// app/admin/approve-lawyers/license-viewer.tsx
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const supabase = createClient();

export default function LicenseViewer({ filePath }: { filePath: string }) {
  console.log('filePath: ', filePath)
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUrl() {
      try {
        setLoading(true);
        const { data, error } = await supabase.storage
          .from('lawyer-licenses')
          .createSignedUrl(filePath, 60); // URL valid for 60 seconds

        if (error) throw error;

        if (data) {
          setUrl(data.signedUrl);
        }
      } catch (e) {
        console.error('Error fetching license URL:', e);
        setError('Failed to load license. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchUrl();
  }, [filePath]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading license...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!url) {
    return <p className="text-sm text-red-500">License not available</p>;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      asChild
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        View License <ExternalLink className="ml-2 h-4 w-4" />
      </a>
    </Button>
  );
}