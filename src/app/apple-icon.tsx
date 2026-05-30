import { ImageResponse } from 'next/og';

// Required under output: 'export' so /apple-icon.png is emitted as a static file.
export const dynamic = 'force-static';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 900,
          borderRadius: 32,
        }}
      >
        LN
      </div>
    ),
    { ...size }
  );
}
