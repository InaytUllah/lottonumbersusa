import { ImageResponse } from 'next/og';

// Required under output: 'export' so /icon.png is emitted as a static file.
export const dynamic = 'force-static';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 900,
          borderRadius: 6,
        }}
      >
        LN
      </div>
    ),
    { ...size }
  );
}
