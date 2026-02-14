"use client"

import httpAdapter from '@/adapters/http/http.adapter';
import { ComponentTypes } from '@/types/components.type'
import React, { useEffect, useState } from 'react'

const Status = () => {
    const [status, setStatus] = useState<ComponentTypes.Status>({
        status: null,
        reason: null
    });

    useEffect(() => {
        async function fetchStatus() {
            const { data } = await httpAdapter.getStatus();
            setStatus(data);
        };

        fetchStatus();
    }, [])
  return (
    <div className={`rounded-[50px] px-2 w-fit flex items-center gap-2 ${status.status === 'Offline' ? 
    'bg-[#026beb22] text-[#026beb] border border-[1px] border-[#026beb]' : 
    'bg-[##2bc70022] text-[#2bc700] border border-[1px] border-[#2bc700]'} 
    ` }>
        <div className={`h-[10px] w-[10px] rounded-[50%] ${status.status && status.status === 'Offline' ? 'bg-[#026beb]': 'bg-[#2bc700]'}`}></div>
        <span>{status.status ?? 'Loading...'}</span>
    </div>
  )
}

export default Status