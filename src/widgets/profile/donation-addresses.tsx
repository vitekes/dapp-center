// src/widgets/profile/donation-addresses.tsx
'use client';

import { DonationAddress } from '@/entities/profile/model/types';
import { ClipboardCopyIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/ui/button';

interface Props {
  addrs: DonationAddress[];
}

export function DonationAddresses({ addrs }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!addrs.length) return <p className="text-gray-500">Адресов нет.</p>;

  return (
    <div className="space-y-2">
      {addrs.map(a => (
        <div key={`${a.chainId}-${a.address}`} className="flex items-center gap-2">
          <code className="truncate">{a.address}</code>
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(a.address);
              setCopied(a.address);
              setTimeout(() => setCopied(null), 1500);
            }}
          >
            <ClipboardCopyIcon size={14} />
          </Button>
          {copied === a.address && <span className="text-xs text-green-600">Скопировано!</span>}
        </div>
      ))}
    </div>
  );
}