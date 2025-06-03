import { encode } from 'blurhash';

/**
 * Возвращает BlurHash + base64-LQIP-превью.
 * ⛑  На сервере (или в среде без Canvas) возвращает пустые строки,
 *     чтобы не вызывать рантайм-ошибок.
 */
export async function generateBlurhash(
  file: File,
  width = 32,
  height = 32,
): Promise<{ hash: string; lqip: string }> {
  /* ───────────── Защита от SSR ───────────── */
  if (typeof window === 'undefined' || typeof createImageBitmap === 'undefined') {
    // Вы находитесь в node/SSR – просто вернём «пустышку»
    return { hash: '', lqip: '' };
  }

  /* ────────── Работаем в браузере ────────── */
  const imgBitmap = await createImageBitmap(file);

  // В Chrome/Edge есть OffscreenCanvas; в Safari/Firefox может не быть.
  const canvas: HTMLCanvasElement | OffscreenCanvas =
    typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(width, height)
      : (() => {
          const el = document.createElement('canvas');
          el.width = width;
          el.height = height;
          return el;
        })();

  /* ---------- получаем 2-d контекст без «any» ---------- */
  const ctx = canvas.getContext('2d') as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null;

  if (!ctx) {
    // крайне маловероятно, но лучше обработать
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.drawImage(imgBitmap, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);

  const hash = encode(imgData.data, imgData.width, imgData.height, 4, 3);

  // Преобразуем в JPEG-Blob. API слегка различается.
  const blob: Blob =
    'convertToBlob' in canvas
      ? // OffscreenCanvas
        await (canvas as OffscreenCanvas).convertToBlob({ type: 'image/jpeg', quality: 0.6 })
      : await new Promise<Blob>((resolve) =>
          (canvas as HTMLCanvasElement).toBlob(
            (b) => resolve(b as Blob),
            'image/jpeg',
            0.6,
          ),
        );

  const lqip = await blobToBase64(blob);
  return { hash, lqip };
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}