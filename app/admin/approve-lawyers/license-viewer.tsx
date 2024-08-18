// app/admin/approve-lawyers/license-viewer.tsx
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export default function LicenseViewer({ filePath }: { filePath: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUrl() {
      const { data } = await supabase.storage
        .from('lawyer-licenses')
        .createSignedUrl(filePath, 60); // URL valid for 60 seconds

      if (data) {
        setUrl(data.signedUrl);
      }
    }

    fetchUrl();
  }, [filePath]);

  if (!url) {
    return <p>Loading license...</p>;
  }

  return (
    <div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        View License
      </a>
    </div>
  );
}