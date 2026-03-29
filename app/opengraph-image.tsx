import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Sarkari Saathi - Free Government Services'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1B3A6B',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div style={{
          fontSize: 64,
          fontWeight: 700,
          color: 'white',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          सरकारी साथी
        </div>
        <div style={{
          fontSize: 32,
          color: '#E8620A',
          fontWeight: 600,
          marginBottom: 24,
        }}>
          Sarkari Saathi
        </div>
        <div style={{
          fontSize: 22,
          color: 'rgba(255,255,255,0.75)',
          textAlign: 'center',
          maxWidth: 800,
        }}>
          Free Government Services Guide · 
          Aadhaar · PAN · Ration Card · 
          Driving License · Govt Schemes
        </div>
        <div style={{
          marginTop: 32,
          fontSize: 16,
          color: 'rgba(255,255,255,0.45)',
        }}>
          No Agents · No Fees · Hindi + English
        </div>
      </div>
    ),
    { ...size }
  )
}
