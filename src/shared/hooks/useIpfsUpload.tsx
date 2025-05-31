import { useCallback, useState} from 'react';
import { ipfs, useLighthouse, lighthouse, lighthouseToken } from '@/shared/config/ipfs';
import { IUploadProgressCallback } from "@lighthouse-web3/sdk/dist/types";

export interface UploadState {
    cid?: string;
    progress: number;   // 0..1
    isUploading: boolean;
    error?: Error;
}

export function useIpfsUpload() {
    const [state, setState] = useState<UploadState>({
        progress: 0,
        isUploading: false,
    });

    const upload = useCallback(
        async (file: File) => {
            setState({progress: 0, isUploading: true});
            try {
                let cid: string;

                if (useLighthouse) {
                    /* ---------- Lighthouse Pinning --------- */
                    const output = await lighthouse.upload(
                        file,
                        lighthouseToken,
                        undefined,
                        (
                            progressData: IUploadProgressCallback & {
                                percentage?: number;
                                uploaded?: number;
                                total?: number;
                            },
                        ) => {
                            const percent =
                                progressData.percentage !== undefined
                                    ? progressData.percentage / 100
                                    : progressData.total
                                        ? (progressData.uploaded ?? 0) / progressData.total
                                        : 0;

                            setState(s => ({
                                ...s,
                                progress: percent,
                            }));
                        },
                    );
                    cid = output.data.Hash;
                } else {
                    /* ---------- Локальный/удалённый ipfs-http-client --------- */
                    const {cid: addedCid} = await ipfs.add(file, {
                        progress: bytes =>
                            setState(s => ({
                                ...s,
                                progress: bytes / file.size,
                            })),
                    });
                    cid = addedCid.toString();
                }


                setState({progress: 1, isUploading: false, cid});
                return cid;
            } catch (e) {
                setState({progress: 0, isUploading: false, error: e as Error});
                throw e;
            }
        },
        [],
    );

    return {...state, upload};
}