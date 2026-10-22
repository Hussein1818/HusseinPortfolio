import { dungeonAudio } from './dungeonAudio';

const CANDIDATE_CV_PATHS = [
  '/Hussein_Mohamed_.NET_CV.pdf',
  '/Hussein_Mohamed_.NET__CV.pdf',
  '/assets/Hussein_Mohamed_.NET_CV.pdf',
];

export async function downloadOfficialCvPdf(
  onErrorToast?: (msg: string) => void
): Promise<void> {
  dungeonAudio.playRuneCollect();

  for (const path of CANDIDATE_CV_PATHS) {
    try {
      const response = await fetch(path, { method: 'GET' });
      const contentType = response.headers.get('content-type') ?? '';

      if (response.ok && contentType.toLowerCase().includes('application/pdf')) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Hussein_Mohamed_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        return;
      }
    } catch {
      // Try next path candidate
    }
  }

  if (onErrorToast) {
    onErrorToast(
      'Please place Hussein_Mohamed_.NET_CV.pdf inside client/public/ folder!'
    );
  }
}