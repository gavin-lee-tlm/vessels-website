/* ═══════════════════════════════════════════════════════════
   VESSELS — Shared Qualification Form Engine
   ───────────────────────────────────────────────────────────
   Renders a 3-step lead form from a per-track config.

   Usage:  <div class="vf" data-track="brands"></div>
           <script src="/assets/vessels-form.js" defer></script>

   Why multi-step: we ask ~4x more qualifying questions than
   before. Asking them all at once would tank completion, so
   step 1 stays low-friction (name/email/site) and the heavy
   questions come after the visitor is already committed.

   To change where leads land: update ENDPOINT below.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Delivery ────────────────────────────────────────────
     FormSubmit hashed endpoint. Currently resolves to Gavin's
     inbox. To repoint at hello@vssls.co, activate that address
     with FormSubmit and swap the hash here — one line, all
     four track pages pick it up.
     ──────────────────────────────────────────────────────── */
  var ENDPOINT = 'https://formsubmit.co/ajax/3d6e21d74712a6047b69ba5e2aff79d9';
  var FALLBACK_EMAIL = 'hello@vssls.co';

  /* ── Shared field builders ─────────────────────────────── */

  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  var TIMEZONES = [
    'ET (Eastern)', 'CT (Central)', 'MT (Mountain)', 'PT (Pacific)',
    'AKT / HT', 'UTC / Europe', 'Other — noted below'
  ];

  // Step 3 is identical across tracks apart from budget ranges.
  function logisticsStep(budgetOptions, budgetHint) {
    return {
      label: 'Fit & Timing',
      title: 'Budget and when we can talk.',
      sub: 'This is the part most forms skip — and it is why most discovery calls waste everyone’s time. Two minutes here means our first call starts with substance.',
      fields: [
        {
          type: 'radio',
          name: 'budget',
          label: 'Working budget',
          required: true,
          hint: 'A range is fine. We will tell you honestly if what you want does not fit what you have — before you spend a call finding out.',
          options: budgetOptions,
          note: budgetHint
        },
        {
          type: 'select',
          name: 'timeline',
          label: 'When do you want to start?',
          required: true,
          options: [
            'As soon as possible',
            'Within 30 days',
            '1–3 months out',
            '3–6 months out',
            'Just exploring for now'
          ]
        },
        {
          type: 'checkboxes',
          name: 'preferred_days',
          label: 'Which days generally work for a call?',
          required: true,
          options: DAYS
        },
        {
          type: 'select',
          name: 'preferred_time',
          label: 'Preferred time of day',
          required: true,
          options: [
            'Morning (8am–11am)',
            'Midday (11am–2pm)',
            'Afternoon (2pm–5pm)',
            'Evening (5pm–7pm)',
            'Flexible — whatever works'
          ]
        },
        {
          type: 'select',
          name: 'timezone',
          label: 'Your time zone',
          required: true,
          options: TIMEZONES
        },
        {
          type: 'textarea',
          name: 'meeting_times',
          label: 'Give us 2–3 specific windows that work',
          required: true,
          placeholder: 'e.g.\nTue Aug 5, 10–11am CT\nWed Aug 6, 2–4pm CT\nFri Aug 8, anytime before noon CT',
          hint: 'We will book one of these and send the invite — no back-and-forth email chain.'
        },
        {
          type: 'select',
          name: 'how_heard',
          label: 'How did you find us?',
          required: false,
          options: [
            'Google / search',
            'Instagram',
            'TikTok',
            'LinkedIn',
            'Referral from a client or partner',
            'A creator we work with',
            'Podcast or press',
            'Other'
          ]
        }
      ]
    };
  }

  // Step 1 is identical across tracks apart from the website label.
  function contactStep(orgLabel, orgPlaceholder, websiteHint) {
    return {
      label: 'Introductions',
      title: 'First, the basics.',
      sub: 'Thirty seconds. Then we get into the parts that actually matter.',
      fields: [
        {
          type: 'row',
          fields: [
            { type: 'text', name: 'first_name', label: 'First name', required: true, placeholder: 'Alex' },
            { type: 'text', name: 'last_name', label: 'Last name', required: true, placeholder: 'Johnson' }
          ]
        },
        {
          type: 'row',
          fields: [
            { type: 'email', name: 'email', label: 'Email', required: true, placeholder: 'alex@company.com' },
            { type: 'tel', name: 'phone', label: 'Phone', required: false, placeholder: '(555) 123-4567' }
          ]
        },
        { type: 'text', name: 'org_name', label: orgLabel, required: true, placeholder: orgPlaceholder },
        {
          type: 'url',
          name: 'website',
          label: 'Website',
          required: true,
          placeholder: 'yourcompany.com',
          hint: websiteHint
        }
      ]
    };
  }

  /* ── Track configurations ──────────────────────────────── */

  var TRACKS = {

    /* ═══ BRANDS — ecommerce / product businesses ═══ */
    brands: {
      subject: 'New Brand Inquiry — Vessels',
      accent: '',
      successTitle: 'We have got what we need.',
      successBody: 'Your answers are in front of us now — not a name and an email we have to chase. We will review your brand and come back within one business day to lock one of the windows you gave us.',
      steps: [
        contactStep('Brand / company name', 'Your Brand', 'We will look at your site, your PDP, and your current creator footprint before the call.'),
        {
          label: 'Your Product',
          title: 'What are we actually selling?',
          sub: 'Creator programs live or die on whether the product can carry demand. These four answers tell us if a program will work — and if you can survive it working.',
          fields: [
            {
              type: 'select',
              name: 'product_category',
              label: 'Product category',
              required: true,
              options: [
                'Beauty & skincare', 'Apparel & accessories', 'Health & supplements',
                'Food & beverage', 'Home & lifestyle', 'Fitness & outdoor',
                'Baby & parenting', 'Pet', 'Electronics & tech', 'Jewelry',
                'Digital product or software', 'Other — described below'
              ]
            },
            {
              type: 'textarea',
              name: 'product_description',
              label: 'What is the product?',
              required: true,
              placeholder: 'What it is, who buys it, what makes it different from the three competitors a shopper is comparing it against.',
              hint: 'Be specific. "Premium skincare" tells us nothing; "a $68 retinol serum for women 35+ with sensitive skin" tells us everything.'
            },
            {
              type: 'row',
              fields: [
                {
                  type: 'select', name: 'monthly_revenue', label: 'Monthly revenue', required: true,
                  options: ['Pre-launch', 'Under $10k/mo', '$10k – $50k/mo', '$50k – $200k/mo', '$200k – $500k/mo', '$500k – $1M/mo', '$1M+/mo']
                },
                {
                  type: 'select', name: 'avg_order_value', label: 'Average order value', required: true,
                  options: ['Under $25', '$25 – $50', '$50 – $100', '$100 – $250', '$250 – $500', '$500+']
                }
              ]
            },
            {
              type: 'select',
              name: 'fulfillment_capacity',
              label: 'If orders tripled next month, could you fulfill them?',
              required: true,
              hint: 'The honest answer here matters more than the impressive one. We have watched brands win a campaign and lose their reviews to a six-week backlog.',
              options: [
                'Yes — we could handle 5x without breaking',
                'Yes — up to about 3x comfortably',
                'Tight — 2x would strain us',
                'No — we would be underwater immediately',
                'Not sure — we have never been tested'
              ]
            },
            {
              type: 'select',
              name: 'lead_time',
              label: 'Production / restock lead time',
              required: true,
              hint: 'This sets our campaign calendar. Long lead times are workable — they just have to be planned around, not discovered mid-flight.',
              options: [
                'Under 2 weeks', '2–4 weeks', '1–2 months',
                '3–4 months', '5+ months', 'Made to order / print on demand', 'Digital — no lead time'
              ]
            },
            {
              type: 'select',
              name: 'current_creator_activity',
              label: 'Where are you with creators today?',
              required: true,
              options: [
                'Nothing yet — starting from zero',
                'Occasional one-off gifting or seeding',
                'A handful of paid partnerships, no system',
                'An affiliate program that underperforms',
                'A running program we want scaled or fixed'
              ]
            },
            {
              type: 'textarea',
              name: 'goals',
              label: 'What does winning look like in 12 months?',
              required: true,
              placeholder: 'Revenue target, channel mix, launches you are planning, or the specific problem you want gone.'
            }
          ]
        },
        logisticsStep([
          'Under $2,500/mo', '$2,500 – $5,000/mo', '$5,000 – $10,000/mo',
          '$10,000 – $25,000/mo', '$25,000+/mo', 'Not sure yet — want guidance'
        ], 'Most brand programs run $5k–$15k/mo including creator spend.')
      ]
    },

    /* ═══ CREATORS ═══ */
    creators: {
      subject: 'New Creator Application — Vessels',
      accent: 'red',
      successTitle: 'Application received.',
      successBody: 'We read every one of these personally — no filter, no assistant. If there is a real fit, we will come back within one business day and take one of the windows you gave us.',
      steps: [
        contactStep('Your name or brand', 'Alex Johnson / @alexbuilds', 'Link your site if you have one — otherwise your main profile is fine.'),
        {
          label: 'Your Audience',
          title: 'Who have you built, and what for?',
          sub: 'We are not counting followers. We are looking at whether there is a real business hiding inside your audience.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  type: 'select', name: 'primary_platform', label: 'Primary platform', required: true,
                  options: ['Instagram', 'TikTok', 'YouTube', 'Podcast', 'Newsletter / Substack', 'X / Twitter', 'Twitch', 'LinkedIn', 'Multi-platform — no single home']
                },
                { type: 'text', name: 'handle', label: 'Primary handle', required: true, placeholder: '@yourhandle' }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  type: 'select', name: 'follower_count', label: 'Audience size', required: true,
                  options: ['Under 5k', '5k – 25k', '25k – 100k', '100k – 500k', '500k – 1M', '1M+']
                },
                {
                  type: 'select', name: 'engagement', label: 'Typical engagement rate', required: false,
                  options: ['Under 1%', '1 – 3%', '3 – 6%', '6 – 10%', '10%+', 'Not sure']
                }
              ]
            },
            { type: 'text', name: 'content_niche', label: 'Your niche', required: true, placeholder: 'Fitness, faith, finance, beauty, gaming…' },
            {
              type: 'select',
              name: 'current_monetization',
              label: 'How do you make money today?',
              required: true,
              options: [
                'Nothing yet — audience only',
                'Occasional brand deals',
                'Consistent brand deals, no other income',
                'Brand deals plus a product or course',
                'A real business — looking to scale it'
              ]
            },
            {
              type: 'select',
              name: 'monthly_creator_income',
              label: 'Roughly, monthly creator income',
              required: true,
              options: ['$0', 'Under $2k/mo', '$2k – $10k/mo', '$10k – $30k/mo', '$30k – $100k/mo', '$100k+/mo']
            },
            {
              type: 'select',
              name: 'team',
              label: 'Who is behind you right now?',
              required: true,
              options: ['Just me', 'Me plus an editor or VA', 'A manager or agent', 'A small team (2–5)', 'A full team (6+)']
            },
            {
              type: 'textarea',
              name: 'goals',
              label: 'What are you actually trying to build?',
              required: true,
              placeholder: 'A product line, a media company, speaking, a community, an exit — or freedom from the brand-deal treadmill.',
              hint: 'The more honest this is, the faster we can tell you whether we are the right partner.'
            }
          ]
        },
        logisticsStep([
          'Nothing to invest right now — revenue share only',
          'Under $1,000/mo', '$1,000 – $3,000/mo',
          '$3,000 – $10,000/mo', '$10,000+/mo', 'Open — depends on the plan'
        ], 'Some creator partnerships are performance-based. Say so if that is what you need.')
      ]
    },

    /* ═══ AI SOLUTIONS — service-based businesses ═══ */
    'ai-solutions': {
      subject: 'New AI / Business Inquiry — Vessels',
      accent: 'teal',
      successTitle: 'Got it — all of it.',
      successBody: 'You just told us more in three minutes than most discovery calls surface in thirty. We will map what is possible for your operation and come back within one business day.',
      steps: [
        contactStep('Business name', 'Freedom Electrical Services', 'We will look at your site and how you currently capture leads before we talk.'),
        {
          label: 'Your Operation',
          title: 'What do you do, and where is it breaking?',
          sub: 'We build into existing operations, not around them. The more we know about how yours runs, the less of the call we spend on questions you have already answered.',
          fields: [
            {
              type: 'select',
              name: 'business_type',
              label: 'What kind of business is this?',
              required: true,
              options: [
                'Home services (HVAC, electrical, plumbing, roofing)',
                'Construction & contracting',
                'Medical, dental, or health practice',
                'Legal practice',
                'Real estate or mortgage',
                'Automotive',
                'Fitness, wellness, or salon',
                'Professional services (accounting, consulting, insurance)',
                'Education or coaching',
                'Restaurant or hospitality',
                'Ecommerce or retail',
                'Other — described below'
              ]
            },
            {
              type: 'textarea',
              name: 'what_you_do',
              label: 'In your own words, what does the business do?',
              required: true,
              placeholder: 'What you sell, who your customers are, what area you serve, and what a typical job or engagement looks like.',
              hint: 'Write it like you would explain it to a neighbor. This is the single most useful answer on the form.'
            },
            {
              type: 'row',
              fields: [
                { type: 'text', name: 'service_area', label: 'Service area', required: true, placeholder: 'DFW metro / nationwide / remote' },
                {
                  type: 'select', name: 'team_size', label: 'Team size', required: true,
                  options: ['Just me', '2–5 people', '6–15 people', '16–50 people', '51–200 people', '200+ people']
                }
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  type: 'select', name: 'monthly_revenue', label: 'Monthly revenue', required: true,
                  options: ['Pre-revenue', 'Under $25k/mo', '$25k – $75k/mo', '$75k – $250k/mo', '$250k – $500k/mo', '$500k – $1M/mo', '$1M+/mo']
                },
                {
                  type: 'select', name: 'lead_volume', label: 'Leads or calls per month', required: true,
                  options: ['Under 25', '25 – 100', '100 – 300', '300 – 1,000', '1,000+', 'No idea — we do not track it']
                }
              ]
            },
            {
              type: 'select',
              name: 'capacity',
              label: 'If we doubled your qualified leads, could you service them?',
              required: true,
              hint: 'Same question we ask every client. There is no point building a lead machine that buries you.',
              options: [
                'Yes — we have real headroom',
                'Yes — with some hiring',
                'Tight — we would need to staff up first',
                'No — we are already at capacity',
                'Not sure'
              ]
            },
            {
              type: 'select',
              name: 'response_time',
              label: 'How fast does an inbound lead actually get a response?',
              required: true,
              options: [
                'Under 5 minutes — always',
                'Within an hour during business hours',
                'Same day, usually',
                'Next day or later',
                'Honestly? Some slip through entirely'
              ]
            },
            {
              type: 'text',
              name: 'current_systems',
              label: 'What software runs your business today?',
              required: true,
              placeholder: 'GoHighLevel, HubSpot, ServiceTitan, Jobber, spreadsheets, nothing…'
            },
            {
              type: 'textarea',
              name: 'looking_for',
              label: 'What are you hoping we can do for you?',
              required: true,
              placeholder: 'Answer every call, stop losing after-hours leads, automate follow-up, replace a task eating your week — or you are not sure yet and want to be shown what is possible.',
              hint: '"I do not know what I need, I just know this is broken" is a completely valid answer.'
            }
          ]
        },
        logisticsStep([
          'Under $500/mo (Starter Kit range)', '$500 – $1,500/mo',
          '$1,500 – $5,000/mo', '$5,000 – $15,000/mo', '$15,000+/mo',
          'One-time build — not monthly', 'Not sure yet — want options'
        ], 'Starter Kits begin at $197/mo. Full AI deployments typically run $1,500–$7,500/mo.')
      ]
    },

    /* ═══ NONPROFITS ═══ */
    nonprofits: {
      subject: 'New Nonprofit Inquiry — Vessels',
      accent: 'green',
      successTitle: 'Thank you — genuinely.',
      successBody: 'We will review what you have shared and come back within one business day. If a mission-aligned rate or a pro bono track makes sense for where you are, we will say so on the call.',
      steps: [
        contactStep('Organization name', 'Your Organization', 'Include your donation page if it lives somewhere separate.'),
        {
          label: 'Your Mission',
          title: 'Who do you serve, and what is in the way?',
          sub: 'We price and scope nonprofit work differently. To do that fairly, we need the real picture — not the version in the grant application.',
          fields: [
            {
              type: 'select',
              name: 'org_type',
              label: 'Type of organization',
              required: true,
              options: [
                'Church or ministry', 'Faith-based nonprofit', 'Secular 501(c)(3)',
                'Foundation', 'Educational institution', 'Community or civic group',
                'International NGO', 'Fiscally sponsored project', 'Not yet incorporated'
              ]
            },
            {
              type: 'textarea',
              name: 'mission',
              label: 'What is the mission?',
              required: true,
              placeholder: 'Who you serve, what you do for them, and what changes because you exist.'
            },
            {
              type: 'row',
              fields: [
                {
                  type: 'select', name: 'org_size', label: 'Staff size', required: true,
                  options: ['All volunteer', '1–3 staff', '4–10 staff', '11–50 staff', '50+ staff']
                },
                {
                  type: 'select', name: 'annual_budget', label: 'Annual operating budget', required: true,
                  options: ['Under $50k', '$50k – $250k', '$250k – $1M', '$1M – $5M', '$5M – $20M', '$20M+']
                }
              ]
            },
            {
              type: 'select',
              name: 'donor_base',
              label: 'Roughly how many active donors?',
              required: true,
              options: ['Under 50', '50 – 250', '250 – 1,000', '1,000 – 5,000', '5,000+', 'We do not track this well']
            },
            {
              type: 'text',
              name: 'current_systems',
              label: 'What tools do you use now?',
              required: true,
              placeholder: 'Donorbox, Planning Center, Salesforce NPSP, Mailchimp, spreadsheets, nothing…'
            },
            {
              type: 'select',
              name: 'gap',
              label: 'Biggest gap right now',
              required: true,
              options: [
                'Donor retention — they give once and vanish',
                'No one answers the phone or inbox in time',
                'Manual admin eating staff and volunteer hours',
                'Website does not convert or is out of date',
                'No data — we cannot see what is working',
                'Communications and storytelling',
                'Volunteer coordination',
                'Something else — described below'
              ]
            },
            {
              type: 'textarea',
              name: 'looking_for',
              label: 'What would make the biggest difference?',
              required: true,
              placeholder: 'If one thing got fixed this year, what would it be — and what has stopped you from fixing it so far?'
            }
          ]
        },
        logisticsStep([
          'Pro bono or grant-funded only', 'Under $500/mo', '$500 – $1,500/mo',
          '$1,500 – $4,000/mo', '$4,000+/mo', 'One-time project budget', 'Not sure — need guidance'
        ], 'We hold mission-aligned pricing and take on a limited number of pro bono builds each year.')
      ]
    }
  };

  /* ── Rendering ─────────────────────────────────────────── */

  var uid = 0;
  function nextId() { return 'vf' + (++uid); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderField(f) {
    if (f.type === 'row') {
      return '<div class="vf-row">' + f.fields.map(renderField).join('') + '</div>';
    }

    var id = nextId();
    var req = f.required ? ' required' : '';
    var optional = f.required ? '' : ' <span class="vf-optional">(optional)</span>';
    var hint = f.hint ? '<p class="vf-hint">' + esc(f.hint) + '</p>' : '';
    var err = '<p class="vf-error">' + esc(f.errorText || 'This one is required.') + '</p>';
    var html = '';

    if (f.type === 'select') {
      html = '<select id="' + id + '" name="' + f.name + '"' + req + '>' +
        '<option value="" disabled selected>Select one…</option>' +
        f.options.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') +
        '</select>';

    } else if (f.type === 'textarea') {
      html = '<textarea id="' + id + '" name="' + f.name + '"' + req +
        ' placeholder="' + esc(f.placeholder || '') + '"></textarea>';

    } else if (f.type === 'radio') {
      var note = f.note ? '<p class="vf-hint">' + esc(f.note) + '</p>' : '';
      return '<div class="vf-group" data-field="' + f.name + '"' + (f.required ? ' data-required="1"' : '') + '>' +
        '<span class="vf-legend">' + esc(f.label) + optional + '</span>' + hint +
        '<div class="vf-options" role="radiogroup" aria-label="' + esc(f.label) + '">' +
        f.options.map(function (o) {
          return '<label class="vf-opt"><input type="radio" name="' + f.name + '" value="' + esc(o) + '"' + req + '>' +
            '<span>' + esc(o) + '</span></label>';
        }).join('') +
        '</div>' + note + err + '</div>';

    } else if (f.type === 'checkboxes') {
      return '<div class="vf-group" data-field="' + f.name + '"' + (f.required ? ' data-required="1"' : '') + '>' +
        '<span class="vf-legend">' + esc(f.label) + optional + '</span>' + hint +
        '<div class="vf-chips">' +
        f.options.map(function (o) {
          return '<label class="vf-chip"><input type="checkbox" name="' + f.name + '" value="' + esc(o) + '">' +
            '<span>' + esc(o) + '</span></label>';
        }).join('') +
        '</div>' + err + '</div>';

    } else {
      html = '<input type="' + f.type + '" id="' + id + '" name="' + f.name + '"' + req +
        ' placeholder="' + esc(f.placeholder || '') + '"' +
        (f.type === 'email' ? ' autocomplete="email"' : '') +
        (f.type === 'tel' ? ' autocomplete="tel"' : '') + '>';
    }

    return '<div class="vf-group" data-field="' + f.name + '"' + (f.required ? ' data-required="1"' : '') + '>' +
      '<label for="' + id + '">' + esc(f.label) + optional + '</label>' + html + hint + err + '</div>';
  }

  function render(mount, track, cfg) {
    var steps = cfg.steps;

    var stepsHtml = steps.map(function (s, i) {
      return '<div class="vf-step' + (i === 0 ? ' is-active' : '') + '" data-step="' + i + '">' +
        '<h3 class="vf-step-title">' + esc(s.title) + '</h3>' +
        '<p class="vf-step-sub">' + esc(s.sub) + '</p>' +
        s.fields.map(renderField).join('') +
        '</div>';
    }).join('');

    mount.innerHTML =
      '<div class="vf-card">' +
        '<div class="vf-progress">' +
          '<div class="vf-progress-meta">' +
            '<span class="vf-step-label"></span>' +
            '<span class="vf-step-count"></span>' +
          '</div>' +
          '<div class="vf-progress-track"><div class="vf-progress-bar"></div></div>' +
        '</div>' +
        '<form novalidate>' +
          '<div class="vf-hp" aria-hidden="true">' +
            '<label>Leave this empty<input type="text" name="_honey" tabindex="-1" autocomplete="off"></label>' +
          '</div>' +
          stepsHtml +
          '<div class="vf-nav">' +
            '<button type="button" class="vf-btn vf-back" style="display:none">← Back</button>' +
            '<button type="button" class="vf-btn vf-next">Continue →</button>' +
            '<button type="submit" class="vf-btn vf-submit" style="display:none">Request My Call →</button>' +
          '</div>' +
          '<div class="vf-banner"></div>' +
        '</form>' +
        '<div class="vf-reassure">' +
          '<span>No commitment</span>' +
          '<span>We reply within 1 business day</span>' +
          '<span>Your details stay with us</span>' +
        '</div>' +
      '</div>' +
      '<div class="vf-success">' +
        '<div class="vf-success-mark">✓</div>' +
        '<h3>' + esc(cfg.successTitle) + '</h3>' +
        '<p>' + esc(cfg.successBody) + '</p>' +
        '<div class="vf-next-steps">Watch for an email from <strong>' + FALLBACK_EMAIL + '</strong> — check spam if you do not see it.</div>' +
      '</div>';

    if (cfg.accent) mount.setAttribute('data-accent', cfg.accent);
    wire(mount, cfg);
  }

  /* ── Behavior ──────────────────────────────────────────── */

  function wire(mount, cfg) {
    var form    = mount.querySelector('form');
    var stepEls = [].slice.call(mount.querySelectorAll('.vf-step'));
    var back    = mount.querySelector('.vf-back');
    var next    = mount.querySelector('.vf-next');
    var submit  = mount.querySelector('.vf-submit');
    var banner  = mount.querySelector('.vf-banner');
    var bar     = mount.querySelector('.vf-progress-bar');
    var label   = mount.querySelector('.vf-step-label');
    var count   = mount.querySelector('.vf-step-count');
    var card    = mount.querySelector('.vf-card');
    var success = mount.querySelector('.vf-success');
    var current = 0;

    function paint() {
      stepEls.forEach(function (el, i) { el.classList.toggle('is-active', i === current); });
      var last = current === stepEls.length - 1;
      back.style.display   = current === 0 ? 'none' : '';
      next.style.display   = last ? 'none' : '';
      submit.style.display = last ? '' : 'none';
      label.textContent = cfg.steps[current].label;
      count.textContent = 'Step ' + (current + 1) + ' of ' + stepEls.length;
      bar.style.width = ((current + 1) / stepEls.length * 100) + '%';
      banner.classList.remove('is-visible');
    }

    // Validate only the visible step, so people are never blocked
    // by an error they cannot see.
    function validateStep() {
      var groups = [].slice.call(stepEls[current].querySelectorAll('.vf-group[data-required]'));
      var firstBad = null;

      groups.forEach(function (g) {
        var inputs = [].slice.call(g.querySelectorAll('input, select, textarea'));
        var ok;

        if (inputs[0] && (inputs[0].type === 'checkbox' || inputs[0].type === 'radio')) {
          ok = inputs.some(function (i) { return i.checked; });
        } else {
          var el = inputs[0];
          ok = el && el.value.trim() !== '';
          if (ok && el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
          if (ok && el.type === 'url')   ok = el.value.trim().length > 3;
        }

        g.classList.toggle('is-invalid', !ok);
        if (!ok && !firstBad) firstBad = g;
      });

      if (firstBad) {
        firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var f = firstBad.querySelector('input, select, textarea');
        if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 320);
        return false;
      }
      return true;
    }

    // Clear the error as soon as they fix it.
    form.addEventListener('input', function (e) {
      var g = e.target.closest('.vf-group');
      if (g) g.classList.remove('is-invalid');
    });
    form.addEventListener('change', function (e) {
      var g = e.target.closest('.vf-group');
      if (g) g.classList.remove('is-invalid');
    });

    function scrollToTop() {
      var top = mount.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }

    next.addEventListener('click', function () {
      if (!validateStep()) return;
      current++;
      paint();
      scrollToTop();
    });

    back.addEventListener('click', function () {
      current--;
      paint();
      scrollToTop();
    });

    // Enter advances instead of submitting a half-filled form.
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (current < stepEls.length - 1) next.click();
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep()) return;

      // Silent bot drop.
      if (form.querySelector('[name="_honey"]').value) {
        card.style.display = 'none';
        success.classList.add('is-visible');
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Sending…';
      banner.classList.remove('is-visible');

      var fd = new FormData(form);
      fd.delete('_honey');

      // Multi-select days arrive as repeated keys; collapse to one line.
      var days = fd.getAll('preferred_days');
      if (days.length) { fd.delete('preferred_days'); fd.set('preferred_days', days.join(', ')); }

      fd.set('_subject', cfg.subject);
      fd.set('_captcha', 'false');
      fd.set('_template', 'table');
      fd.set('submitted_from', window.location.href);

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fd
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (json) {
          // FormSubmit returns HTTP 200 with success:"false" on failure,
          // so the status code alone is not enough to trust.
          var ok = json && (json.success === true || json.success === 'true');
          if (!ok) throw new Error(json && json.message ? json.message : 'Submission rejected');

          card.style.display = 'none';
          success.classList.add('is-visible');
          scrollToTop();

          if (window.gtag) window.gtag('event', 'generate_lead', { form: cfg.subject });
          if (window.dataLayer) window.dataLayer.push({ event: 'vessels_lead', form: cfg.subject });
        })
        .catch(function () {
          // Never fake success — a lost lead the visitor thinks
          // was delivered is the worst possible outcome.
          submit.disabled = false;
          submit.textContent = 'Try Again →';
          banner.innerHTML = 'That did not go through. Please try once more — or email us directly at ' +
            '<a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a> and we will pick it up from there.';
          banner.classList.add('is-visible');
        });
    });

    paint();
  }

  /* ── Boot ──────────────────────────────────────────────── */

  function init() {
    [].slice.call(document.querySelectorAll('.vf[data-track]')).forEach(function (mount) {
      var track = mount.getAttribute('data-track');
      var cfg = TRACKS[track];
      if (!cfg) { console.warn('[vessels-form] unknown track:', track); return; }
      render(mount, track, cfg);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
