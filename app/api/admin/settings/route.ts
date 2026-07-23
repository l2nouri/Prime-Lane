import { NextResponse } from 'next/server';
import { createClient as createAuthClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

const AVAILABLE_MODELS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5' },
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8' },
  { id: 'claude-fable-5', label: 'Claude Fable 5' },
] as const;

const VALID_MODEL_IDS = new Set(AVAILABLE_MODELS.map((m) => m.id));

async function requireUser() {
  const authSupabase = await createAuthClient();
  const { data: { user } } = await authSupabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'active_model')
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    activeModel: data?.value ?? DEFAULT_MODEL,
    availableModels: AVAILABLE_MODELS,
  });
}

export async function PUT(req: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { model?: string } | null;
  const model = body?.model;
  if (!model || !VALID_MODEL_IDS.has(model as typeof AVAILABLE_MODELS[number]['id'])) {
    return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'active_model', value: model, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activeModel: model });
}
