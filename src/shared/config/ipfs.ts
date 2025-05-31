import {create} from 'ipfs-http-client';
import lighthouse from '@lighthouse-web3/sdk';

const IPFS_ENDPOINT =
    process.env.NEXT_PUBLIC_IPFS_ENDPOINT ?? 'http://127.0.0.1:5001';

export const ipfs = create({url: IPFS_ENDPOINT});

/**
 * Токен для lighthouse хранится в .env.local;
 * нужен только в prod-режиме, когда мы хотим пиннить файл «навсегда».
 */
export const lighthouseToken = process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY ?? '';
export const useLighthouse = !!lighthouseToken;
export { lighthouse };