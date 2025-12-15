
import { Product } from './types';

export const EX_RATE_IND = 1.6;
export const MAX_KIM_POINTS = 20;
export const DISCOUNT_PER_POINT = 0.005; // 0.5%

export const COUPONS: Record<string, number> = {
  'KIMNEW2': 0.02,
  'KIMGIFT': 0.02,
  'KIMTIHAR': 0.03,
  'KIMXMAS': 0.03,
  'SAVE5': 0.05
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Robux Credit",
    category: "gift-cards",
    delivery: "Instant",
    image: "https://i.pinimg.com/736x/04/4f/f7/044ff7842e79a82d32cb4e17721cd8c7.jpg",
    description: "Top up your Roblox account. Unlock premium outfits, special skills, and private servers.",
    requiresAccountId: true,
    plans: [
      { id: "rbx-400", name: "400 Robux", price: 500, features: ["Instant Delivery", "Global Region"], validity: "Lifetime", stock: 15 },
      { id: "rbx-1000", name: "1000 Robux", price: 1200, features: ["Instant Delivery", "Bonus Item"], validity: "Lifetime", stock: 4 },
      { id: "rbx-2500", name: "2500 Robux", price: 2800, features: ["Instant Delivery", "Premium Status"], validity: "Lifetime", stock: 8 },
    ],
    reviews: [
      { id: "r1", user: "Alex G.", rating: 5, comment: "Super fast delivery, code worked instantly!", date: "2 days ago" },
      { id: "r2", user: "Sarah M.", rating: 4, comment: "Great price, but took 5 mins to arrive.", date: "1 week ago" }
    ]
  },
  {
    id: 4,
    name: "Spotify Premium",
    category: "subscriptions",
    delivery: "Instant",
    image: "https://miro.medium.com/v2/resize:fit:1400/1*emFHVKnFwHwboIeJiPA5mA.png",
    description: "Ad-free music listening, unlimited skips, and offline playback capabilities.",
    requiresAccountId: false,
    plans: [
      { id: "spt-ind", name: "Individual", price: 600, features: ["1 Month", "1 Account", "Ad-free"], validity: "1 Month", stock: 25 },
      { id: "spt-duo", name: "Duo", price: 1700, features: ["3 Months", "2 Accounts", "Shared Playlist"], validity: "3 Months", stock: 12 },
      { id: "spt-fam", name: "Family", price: 3500, features: ["6 Months", "6 Accounts", "Parental Control"], validity: "6 Months", stock: 0 },
    ],
    reviews: [
      { id: "r1", user: "MusicLover", rating: 5, comment: "Cheapest rates I found online.", date: "3 days ago" },
      { id: "r2", user: "John Doe", rating: 5, comment: "Family plan setup was smooth.", date: "2 weeks ago" }
    ]
  },
  {
    id: 201,
    name: "Netflix",
    category: "subscriptions",
    delivery: "Instant",
    image: "https://images.ctfassets.net/y2ske730sjqp/1aONibCke6niZhgPxuiilC/2c401b05a07288746ddf3bd3943fbc76/BrandAssets_Logos_01-Wordmark.jpg?w=940",
    description: "Watch movies, TV shows, and anime on your favorite devices.",
    requiresAccountId: false,
    plans: [
      { id: "nfx-mob", name: "Mobile", price: 800, features: ["1 Month", "480p", "Phone/Tablet Only"], validity: "1 Month", stock: 50 },
      { id: "nfx-std", name: "Standard", price: 1500, features: ["1 Month", "1080p", "2 Devices Supported"], validity: "1 Month", stock: 3 },
      { id: "nfx-prm", name: "Premium", price: 2200, features: ["1 Month", "4K HDR", "4 Devices + Spatial Audio"], validity: "1 Month", stock: 10 },
    ],
    reviews: [
      { id: "r1", user: "Cinephile", rating: 4, comment: "Works great on my iPad.", date: "1 day ago" }
    ]
  },
  {
    id: 2,
    name: "Minecraft",
    category: "games",
    delivery: "Code",
    image: "https://cdn.worldvectorlogo.com/logos/minecraft-launcher.svg",
    description: "The official Java & Bedrock Edition key. Build, explore, and survive.",
    requiresAccountId: false,
    plans: [
      { id: "mc-std", name: "Java + Bedrock", price: 3000, features: ["PC/Mac", "Permanent License", "Launcher Included"], validity: "Lifetime", stock: 20 },
      { id: "mc-rlm", name: "Realms Plus", price: 500, features: ["1 Month Subscription", "10 Player Server", "Cloud Saves"], validity: "1 Month", stock: 100 },
    ],
    reviews: [
      { id: "r1", user: "Steve", rating: 5, comment: "Finally got my official account!", date: "5 days ago" }
    ]
  },
  {
    id: 104,
    name: "GTA V",
    category: "games",
    delivery: "Key",
    image: "https://media.licdn.com/dms/image/v2/C5112AQHRjM-t0obKmQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520203718131?e=2147483647&v=beta&t=Lb0LEMVOxzgxSRqfxZWBUtdKUkTu8zpzrpO9Ji90yf8",
    description: "Experience the ultimate open-world adventure in Los Santos. Includes GTA Online.",
    requiresAccountId: false,
    plans: [
      { id: "gta-prem", name: "Premium Edition", price: 1500, features: ["Full Game", "Criminal Enterprise Pack", "$1M Bonus Cash"], validity: "Lifetime", stock: 25 },
      { id: "gta-shark", name: "Megalodon Shark", price: 8000, features: ["$8,000,000 GTA$", "Instant Credit", "Online Only"], validity: "Lifetime", stock: 10 },
    ],
    reviews: [
      { id: "r1", user: "Trevor P.", rating: 5, comment: "Chaos awaits!", date: "1 week ago" }
    ]
  },
  {
    id: 301,
    name: "Discord Nitro",
    category: "subscriptions",
    delivery: "Gift Link",
    image: "https://cdn-offer-photos.zeusx.com/01ade0a8-188b-41e0-9528-fd84679c998e.jpg",
    description: "Unlock perks like animated avatars, custom emojis, and larger file uploads.",
    requiresAccountId: false,
    plans: [
      { id: "dsc-basic", name: "Nitro Basic", price: 450, features: ["1 Month", "50MB Uploads", "Custom Emoji"], validity: "1 Month", stock: 30 },
      { id: "dsc-full", name: "Nitro", price: 1200, features: ["1 Month", "500MB Uploads", "HD Streaming", "2 Boosts"], validity: "1 Month", stock: 15 },
      { id: "dsc-year", name: "Nitro Yearly", price: 12000, features: ["12 Months", "All Nitro Perks", "24 Boosts Total"], validity: "1 Year", stock: 5 },
    ],
    reviews: [
      { id: "r1", user: "Wumpus", rating: 5, comment: "Love the animated profile picture!", date: "1 day ago" }
    ]
  },
  {
    id: 302,
    name: "YouTube Premium",
    category: "subscriptions",
    delivery: "Invite",
    image: "https://imagematrix.tech/wp-content/uploads/2025/06/IMT-YOUTUBE-PREMIUM.jpg",
    description: "YouTube and YouTube Music ad-free, offline, and in the background.",
    requiresAccountId: true,
    plans: [
      { id: "yt-ind", name: "Individual", price: 550, features: ["1 Month", "Ad-Free", "Background Play"], validity: "1 Month", stock: 40 },
      { id: "yt-fam", name: "Family", price: 900, features: ["1 Month", "Up to 5 Members", "Ad-Free"], validity: "1 Month", stock: 0 },
    ],
    reviews: []
  },
  {
    id: 303,
    name: "Amazon Prime Video",
    category: "subscriptions",
    delivery: "Account",
    image: "https://cdn.jwplayer.com/v2/media/LMGFzJdg/poster.jpg?width=1920",
    description: "Watch exclusive Amazon Originals as well as popular movies and TV shows.",
    requiresAccountId: false,
    plans: [
      { id: "amz-1m", name: "1 Month", price: 400, features: ["UHD Quality", "3 Devices", "Offline Download"], validity: "1 Month", stock: 20 },
      { id: "amz-6m", name: "6 Months", price: 2000, features: ["UHD Quality", "3 Devices", "X-Ray Feature"], validity: "6 Months", stock: 10 },
    ],
    reviews: [
      { id: "r1", user: "BingeWatcher", rating: 4, comment: "Great for The Boys season 4.", date: "3 weeks ago" }
    ]
  },
  {
    id: 401,
    name: "Canva Pro",
    category: "subscriptions",
    delivery: "Invite",
    image: "https://5.imimg.com/data5/SELLER/Default/2025/1/483342275/ZM/IJ/RO/233734855/canva-pro-lifetime-access-selar-co-65b6705f9cd19-jpeg.jpeg",
    description: "Unlock premium content, powerful design tools, and AI features for designers.",
    requiresAccountId: true,
    plans: [
      { id: "cnv-1m", name: "1 Month", price: 250, features: ["Pro Team Invite", "All Premium Assets", "AI Magic Tools"], validity: "1 Month", stock: 50 },
      { id: "cnv-1y", name: "1 Year", price: 1500, features: ["Pro Team Invite", "All Premium Assets", "100GB Storage"], validity: "1 Year", stock: 20 },
      { id: "cnv-life", name: "Lifetime", price: 2500, features: ["Education/Team License", "One-time Payment", "Premium Features"], validity: "Lifetime", stock: 10 },
    ],
    reviews: [
      { id: "r1", user: "DesignerPro", rating: 5, comment: "Magic Resize is a lifesaver!", date: "2 days ago" }
    ]
  }
];
