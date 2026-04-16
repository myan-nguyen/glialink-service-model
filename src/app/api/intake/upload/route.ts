import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const formData = await request.formData()
  const email = formData.get('email') as string
  const files = formData.getAll('files') as File[]

  if (!email || files.length === 0) {
    return NextResponse.json({ error: 'Missing email or files' }, { status: 400 })
  }

  const paths: string[] = []

  for (const file of files) {
    const buffer = await file.arrayBuffer()
    const path = `${email}/${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('researcher-materials')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
    }

    paths.push(path)
  }

  return NextResponse.json({ paths })
}