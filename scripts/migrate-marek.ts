/**
 * Marek Masiak — Type A researcher profile migration
 *
 * Upserts Marek's artifact with the v2 section schema and publishes it.
 *
 * Run:
 *   SUPABASE_SERVICE_ROLE_KEY=<key> NEXT_PUBLIC_SUPABASE_URL=<url> npx tsx scripts/migrate-marek.ts
 *
 * Safe to run multiple times — it checks for an existing artifact by slug before creating.
 */

import { createClient } from '@supabase/supabase-js'

const SLUG = 'marek-masiak-researcher-profile-7B9QLG'
const RESEARCHER_EMAIL = 'marek.masiak@example.com' // update to actual email if known

const SECTIONS = {
  _v2: true,

  identity: {
    content: {
      name: 'Marek Masiak',
      role: 'PhD Researcher',
      institution: 'University of Oxford',
      group: 'Torr Vision Group',
      fieldDescriptor: 'Mechanistic interpretability of neural networks',
    },
  },

  workStatement: {
    content: {
      paragraphs: [
        'I work on mechanistic interpretability — specifically, model diffing: identifying what changes inside a neural network when it gets fine-tuned. The motivation is safety. Fine-tuning is how most capability gets added to frontier models and we currently cannot inspect what was added. If you want to know whether a fine-tuned model has been made deceptive, diffing its internals against the base is one of the few concrete avenues I know of.',
        'I\'m trying to understand how and why neural networks work. I think of myself as translating between the technical work of making models legible and the broader conversations about safety that depend on that legibility being real.',
      ],
      inlineReferences: [
        {
          label: 'Workshop paper [pdf] (preliminary; method has evolved)',
          url: '#',
        },
        {
          label: 'Collaborators: Torr (Oxford), DeepMind (Nanda\'s group), Cambridge',
          url: null,
        },
      ],
    },
  },

  freshness: {
    content: {
      pageCreatedAt: '2026-04-14',
      lastEditedAt: '2026-04-17',
    },
  },

  trustStrip: {
    content: {
      advisors: ['Phillip Torr (Oxford)'],
      collaborators: [
        "Neel Nanda's team at Google DeepMind",
        'Collaborator at University of Cambridge',
      ],
      funding: 'Ellison Institute of Technology',
      linkedPapers: [
        {
          title: 'Workshop paper on model diffing',
          url: '#',
          note: 'preliminary; method has evolved since submission',
        },
      ],
    },
  },

  whatImOpenTo: {
    content: {
      items: [
        {
          type: 'exploratory_note',
          body: "I'm trying to figure out how to build a credible public presence for this work without producing content from scratch — if you've navigated that transition as a researcher, I'd find it useful to hear how.",
          interestedLabel: 'Say hi',
          forwardLabel: 'Know someone who did this well? Forward',
        },
      ],
    },
  },

  whatIBring: {
    content: {
      paragraphs: [
        'Deep technical grounding in mechanistic interpretability and LLM internals, combined with an unusual ability to translate that work for non-technical decision-makers — what I think of as being the glue between the two worlds.',
        "Embedded in a well-connected network: Oxford's Torr Vision Group, Anthropic-adjacent via Neel Nanda's group at DeepMind, Cambridge. Open to policy-adjacent conversations where the science is relevant, though I frame this as a side interest rather than a primary offering.",
      ],
    },
  },

  activeProjects: {
    content: {
      projects: [
        {
          title: 'Model Diffing',
          oneLine:
            'Detecting internal changes in fine-tuned LLMs. Workshop paper available; method has evolved.',
          url: '/p/marek-masiak-model-diffing',
        },
      ],
    },
  },

  perspective: {
    content: {
      quote:
        "I'm trying to understand how and why neural networks work. Just having an idea is not good enough if you can't execute.",
      description:
        'Marek is direct and self-aware — he describes his own uncertainties without prompting, including doubts about his own approach. He values transparency while being appropriately cautious about when and how to share unpublished work.',
    },
  },
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  // Check if artifact exists
  const { data: existing } = await supabase
    .from('artifacts')
    .select('id, slug, status')
    .eq('slug', SLUG)
    .is('deleted_at', null)
    .maybeSingle()

  if (existing) {
    console.log(`Found existing artifact: ${existing.id} (status: ${existing.status})`)
    const { error } = await supabase
      .from('artifacts')
      .update({
        sections: SECTIONS,
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        generation_status: 'complete',
      })
      .eq('id', existing.id)

    if (error) {
      console.error('Update failed:', error.message)
      process.exit(1)
    }
    console.log('Updated successfully.')
    return
  }

  // No existing artifact — ensure researcher row exists first
  const { data: researcher } = await supabase
    .from('researchers')
    .select('email')
    .eq('email', RESEARCHER_EMAIL)
    .maybeSingle()

  if (!researcher) {
    const { error: rErr } = await supabase.from('researchers').insert({
      email: RESEARCHER_EMAIL,
      full_name: 'Marek Masiak',
      institution: 'University of Oxford',
      department_or_lab: 'Torr Vision Group',
      role_career_stage: 'Grad',
      field_and_subfield: 'Mechanistic interpretability of neural networks',
      ai_comfort: 'Yes',
    })
    if (rErr) {
      console.error('Failed to create researcher:', rErr.message)
      process.exit(1)
    }
    console.log('Created researcher row.')
  }

  const { error: insertError } = await supabase.from('artifacts').insert({
    researcher_email: RESEARCHER_EMAIL,
    output_type: 'researcher_profile',
    status: 'published',
    slug: SLUG,
    intake_data: {
      current_focus: 'Model diffing and mechanistic interpretability',
      who_you_want_to_reach: 'Safety-minded researchers and policy-adjacent audiences',
      what_you_offer: 'Technical expertise in LLM internals and ability to translate to non-technical audiences',
      file_uploads: [],
      anything_not_public: '',
    },
    sections: SECTIONS,
    generation_status: 'complete',
    published_at: new Date().toISOString(),
  })

  if (insertError) {
    console.error('Insert failed:', insertError.message)
    process.exit(1)
  }

  console.log(`Created new artifact with slug: ${SLUG}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
