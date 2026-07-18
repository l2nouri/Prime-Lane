import { NextResponse } from 'next/server';
import { createClient as createAuthClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const CLIENT_ID = 'lenava';

async function requireUser() {
  const authSupabase = await createAuthClient();
  const { data: { user } } = await authSupabase.auth.getUser();
  return user;
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: 'voyage-3-lite',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Voyage AI embeddings error: ${err}`);
  }

  const data = (await response.json()) as { data: Array<{ embedding: number[] }> };
  return data.data[0].embedding;
}

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('documents')
    .select('id, content, metadata, created_at')
    .eq('client_id', CLIENT_ID)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents: data ?? [] });
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { content?: string } | null;
  const content = body?.content?.trim();
  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }

  const supabase = createAdminClient();

  let embedding: number[];
  try {
    embedding = await getEmbedding(content);
  } catch {
    return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 502 });
  }

  const { data, error } = await supabase
    .from('documents')
    .insert({ client_id: CLIENT_ID, content, embedding })
    .select('id, content, metadata, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ document: data });
}

export async function PUT(req: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { id?: string; content?: string } | null;
  const id = body?.id;
  const content = body?.content?.trim();
  if (!id || !content) {
    return NextResponse.json({ error: 'Missing id or content' }, { status: 400 });
  }

  const supabase = createAdminClient();

  let embedding: number[];
  try {
    embedding = await getEmbedding(content);
  } catch {
    return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 502 });
  }

  const { data, error } = await supabase
    .from('documents')
    .update({ content, embedding })
    .eq('id', id)
    .eq('client_id', CLIENT_ID)
    .select('id, content, metadata, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ document: data });
}

export async function DELETE(req: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('client_id', CLIENT_ID);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
