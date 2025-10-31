# 🎓 Flunks High School - Flow Blockchain Hackathon Submission

A fully-featured Web3 social experience built on the Flow blockchain, combining NFT-gated access, gamification, and interactive storytelling.

## 🌟 Key Features

### NFT Integration
- **Flow Blockchain Integration**: Mainnet deployment using FCL (Flow Client Library)
- **NFT-Gated Access**: Flunks NFT holders get exclusive access to features
- **Hybrid Custody Support**: Seamless wallet management and NFT detection
- **Multiple Collections**: Support for Flunks, Backpack, and other collections

### Gamification System
- **GUM Currency**: Custom in-game currency with database-backed transactions
- **Achievement System**: Track progress across 5 chapters of content
- **Daily Rewards**: Login bonuses and time-based challenges
- **Leaderboards**: Competitive features like Flunky Uppy scores

### Interactive World
- **Semester Zero Map**: Explore clique houses, locations, and mini-games
- **Paradise Motel (Chapter 5)**: Multi-room experience with puzzles and rewards
- **Chat Rooms**: Social features for community interaction
- **Dynamic Content**: Day/night cycles and time-based events

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Flow (Mainnet), Cadence smart contracts
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Dynamic.xyz with Flow wallet support
- **Deployment**: Vercel

## 📂 Project Structure

```
├── src/               # Main application source
│   ├── components/    # Reusable React components
│   ├── contexts/      # React context providers
│   ├── pages/         # Next.js pages and API routes
│   ├── utils/         # Utility functions
│   └── windows/       # Window-based UI components
├── public/            # Static assets
├── cadence/           # Flow Cadence contracts
├── supabase/          # Database schemas and functions
├── docs/              # Documentation
├── sql-migrations/    # Database migrations
├── admin-scripts/     # Admin utilities
├── test-scripts/      # Testing tools
└── deployment-scripts/# Deployment automation
```

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see `.env.example`)

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## 🔗 Flow Blockchain Integration

- **Contract Address**: `0x807c3d470888cc48` (Mainnet)
- **Network**: Flow Mainnet
- **Key Contracts**: HybridCustodyHelper, NFT detection scripts

## 📱 Features Highlights

### Chapter 5: Paradise Motel
- Room exploration with NFT rewards
- Time-based puzzles (day/night mechanics)
- GUM reward system
- Key-based access control

### Social Features
- OnlyFlunks: NFT holder profiles
- Chat rooms with clique-based access
- Meme generator and sharing
- Profile customization

### Mini-Games
- Flunky Uppy: Competitive flappy-bird style game
- Flunko: Prize wheel mechanics
- Zoltar Fortune Machine
- Homecoming Dance events

## 🏆 Hackathon Highlights

This project showcases:
- ✅ Complex NFT integration with Flow blockchain
- ✅ Hybrid custody implementation
- ✅ Advanced state management across blockchain and database
- ✅ Real-time social features
- ✅ Mobile-responsive design
- ✅ Production-ready deployment on Vercel

## 📚 Documentation

See the `/docs` folder for detailed guides on:
- Feature implementation
- Bug fixes and solutions
- Deployment procedures
- Database schemas

---

Built with ❤️ for the Flow blockchain ecosystem
