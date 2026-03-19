import { ImageResponse } from 'next/og';

export const alt = 'Lotto Numbers USA - Latest US Lottery Results';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 40,
              fontWeight: 900,
            }}
          >
            LN
          </div>
          <div style={{ color: 'white', fontSize: 48, fontWeight: 800 }}>
            Lotto Numbers USA
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: '#93c5fd',
            fontSize: 28,
            fontWeight: 500,
            marginBottom: 50,
            textAlign: 'center',
          }}
        >
          Latest Powerball, Mega Millions & State Lottery Results
        </div>

        {/* Lottery balls */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[7, 14, 33, 46, 59].map((num) => (
            <div
              key={num}
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
                fontWeight: 800,
                color: '#1e3a8a',
              }}
            >
              {num}
            </div>
          ))}
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 800,
              color: 'white',
            }}
          >
            12
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            color: '#64748b',
            fontSize: 20,
            marginTop: 40,
          }}
        >
          lottonumbersusa.com
        </div>
      </div>
    ),
    { ...size }
  );
}
