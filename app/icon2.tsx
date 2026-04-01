import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 16, height: 16 }
export const contentType = 'image/png'

export default function Icon() {
  const logoData = readFileSync(join(process.cwd(), 'public', 'sarkari-saathi-logo.png')).toString('base64');
  const src = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: '4px', 
        }}
      >
        <img src={src} width="14" height="14" style={{ objectFit: 'contain' }} alt="Logo" />
      </div>
    ),
    { ...size }
  )
}
