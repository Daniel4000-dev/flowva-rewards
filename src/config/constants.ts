export const REWARD_CONFIG = {
  MAX_POINTS_DISPLAY: 5000,
  DAILY_STREAK_REWARD: 5,
  REFERRAL_BONUS: 10000,
  CURRENCY_SYMBOL: "$",
};

export const MOCK_USER = {
  name: "Big",
  email: "dadekunle31@gmail.com",
  avatar: "https://github.com/shadcn.png",
};

export const MOCK_REWARDS = [
  // 1. Cash/Transfer Items
  { id: 1, title: "$5 Bank Transfer", description: "The $5 equivalent will be transferred to your bank account.", cost: 5000, type: "transfer", is_active: true },
  { id: 2, title: "$5 PayPal International", description: "Receive a $5 PayPal balance transfer directly to your PayPal account email.", cost: 5000, type: "transfer", is_active: true },
  { id: 3, title: "$5 Virtual Visa Card", description: "Use your $5 prepaid card to shop anywhere Visa is accepted online.", cost: 5000, type: "card", is_active: true },
  
  // 2. Gift Cards
  { id: 4, title: "$5 Apple Gift Card", description: "Redeem this $5 Apple Gift Card for apps, games, music, movies, and more.", cost: 5000, type: "gift_card", is_active: true },
  { id: 5, title: "$5 Google Play Card", description: "Use this $5 Google Play Gift Card to purchase apps, games, movies, books.", cost: 5000, type: "gift_card", is_active: true },
  { id: 6, title: "$5 Amazon Gift Card", description: "Get a $5 digital gift card to spend on your favorite tools or platforms.", cost: 5000, type: "gift_card", is_active: true },
  
  // 3. Higher Tier
  { id: 7, title: "$10 Amazon Gift Card", description: "Get a $10 digital gift card to spend on your favorite tools or platforms.", cost: 10000, type: "gift_card", is_active: true },
  
  // 4. Coming Soon
  { id: 8, title: "Free Udemy Course", description: "Coming Soon!", cost: 0, type: "course", is_active: false },
];