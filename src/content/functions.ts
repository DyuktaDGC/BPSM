export type Fn = {
  n: string;
  title: string;
  color: string;
  said: string;
  gets: [string, string, string];
  feeds: string;
};

export const FUNCTIONS: Fn[] = [
  {
    n: '01',
    title: 'Vision & Business Clarity Function',
    color: 'var(--c1)',
    said: 'You started the business, you grew it — but kabhi baithke socha nahi ki it’s actually headed where.',
    gets: [
      'Where the business actually stands today',
      'A target for next year, a 3-year vision',
      'Owner ho — ya apne hi business mein employee?',
    ],
    feeds: 'Analytics',
  },
  {
    n: '02',
    title: 'Market Research & Product Strategy Function',
    color: 'var(--c2)',
    said: 'Who is your customer, actually — aur jab woh “nahi” bolte hain, real objection kya hai?',
    gets: [
      'Pain points and the buying trigger',
      'Competitor analysis you run yourself',
      'An offer jise “na” kehna mushkil ho',
    ],
    feeds: 'Product',
  },
  {
    n: '03',
    title: 'Marketing & Lead Generation Function',
    color: 'var(--c3)',
    said: 'Some months leads flood in, some months there’s nothing — kyunki system nahi hai, sirf occasional effort.',
    gets: [
      'One lead engine: organic + paid',
      'Content and positioning that hold up',
      'Leads you can forecast, not hope for',
    ],
    feeds: 'Sales',
  },
  {
    n: '04',
    title: 'Sales & Customer Conversion Function',
    color: 'var(--c4)',
    said: 'Lead aata hai, phir follow-up hota hi nahi — inquiry chup-chaap kisi ke inbox mein mar jaati hai.',
    gets: [
      'A sales process with a real script',
      'Objection handling your team can use',
      'Follow-up that runs without you',
    ],
    feeds: 'Sales',
  },
  {
    n: '05',
    title: 'Team & People Leadership Function',
    color: 'var(--c5)',
    said: 'Hiring happens purely on trust — “accha banda hai,” bas itna hi.',
    gets: [
      'JDs and interviews that actually judge',
      'KPIs and reviews on a calendar',
      'A way to grow the right people',
    ],
    feeds: 'Employee performance',
  },
  {
    n: '06',
    title: 'Operations & Productivity Function',
    color: 'var(--c6)',
    said: 'Business ek din bhi aapke bina nahi chalta — sab kuch aapke head mein hai, kagaz pe kuch nahi.',
    gets: [
      'SOPs written down, not remembered',
      'Departments with clear ownership',
      'It runs whether you’re there or not',
    ],
    feeds: 'Employee performance',
  },
  {
    n: '07',
    title: 'Finance, Technology & Growth Function',
    color: 'var(--c7)',
    said: 'Revenue number toh pata hai. Profit kahan leak ho raha hai — woh nahi pata.',
    gets: [
      'Hidden expenses, caught monthly',
      'Cash flow you can actually plan on',
      'Tech to scale without losing control',
    ],
    feeds: 'Finance + P&L',
  },
];