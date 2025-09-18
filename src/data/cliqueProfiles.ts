export interface Friend {
  name: string;
  status: string;
}

export interface CliqueProfile {
  name: string;
  clique: string;
  backgroundColor: string;
  backgroundPattern: string;
  mood: string;
  location: string;
  age: string;
  lastLogin: string;
  profileViews: number;
  aboutMe: string;
  favoriteQuote: string;
  interests: string[];
  music: string[];
  movies: string[];
  books: string[];
  heroes: string[];
  likes: string[];
  dislikes: string[];
  topFriends: Friend[];
  profileSong?: string;
}

export const BACKGROUND_PATTERNS = {
  stars: "data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='stars' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpolygon fill='%23ffffff' fill-opacity='0.3' points='10,1 4,7 10,4 16,7'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23stars)'/%3E%3C/svg%3E",
  hearts: "data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='hearts' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M10,6 C8,1 2,1 2,6 C2,10 10,18 10,18 C10,18 18,10 18,6 C18,1 12,1 10,6 Z' fill='%23ff69b4' fill-opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23hearts)'/%3E%3C/svg%3E",
  checkers: "data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='checkers' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Crect width='10' height='10' fill='%23000000' fill-opacity='0.1'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23000000' fill-opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23checkers)'/%3E%3C/svg%3E",
  flowers: "data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='flowers' x='0' y='0' width='30' height='30' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='15' cy='15' r='3' fill='%23ffb3ba' fill-opacity='0.4'/%3E%3Ccircle cx='8' cy='8' r='2' fill='%23baffc9' fill-opacity='0.4'/%3E%3Ccircle cx='22' cy='22' r='2' fill='%23bae1ff' fill-opacity='0.4'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23flowers)'/%3E%3C/svg%3E",
  glitter: "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='glitter' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpolygon points='20,5 22,10 27,10 23,14 25,19 20,16 15,19 17,14 13,10 18,10' fill='%23ffd700' fill-opacity='0.3'/%3E%3Cpolygon points='8,25 9,27 11,27 10,28 10,30 8,29 6,30 6,28 5,27 7,27' fill='%23ffd700' fill-opacity='0.3'/%3E%3Cpolygon points='32,8 33,10 35,10 34,11 34,13 32,12 30,13 30,11 29,10 31,10' fill='%23ffd700' fill-opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23glitter)'/%3E%3C/svg%3E"
};

export const CLIQUE_PROFILES: Record<string, CliqueProfile> = {
  'the-populars': {
    name: "Madison Elite",
    clique: "the-populars",
    backgroundColor: "#ff69b4",
    backgroundPattern: "glitter",
    mood: "Fabulous ✨",
    location: "The Top of the Social Ladder",
    age: "Forever Young",
    lastLogin: "2 minutes ago",
    profileViews: 15742,
    aboutMe: "OMG hey everyone! I'm Madison and I'm like, totally the queen bee of this school! I love shopping at the mall, getting my nails done, and being absolutely PERFECT in every way! If you're not popular, don't even bother messaging me unless you have something I want! XOXO 💋",
    favoriteQuote: "I'm not mean, I'm just better than you! 💅",
    interests: ["Shopping", "Fashion", "Gossip", "Being Popular", "Pink Everything", "Starbucks", "Drama", "Social Status"],
    music: ["Britney Spears", "Christina Aguilera", "Destiny's Child", "Backstreet Boys", "NSYNC", "Mariah Carey"],
    movies: ["Mean Girls", "Clueless", "Legally Blonde", "She's All That", "10 Things I Hate About You", "Cruel Intentions"],
    books: ["Fashion magazines", "Gossip Girl", "The Princess Diaries", "Does Vogue count?"],
    heroes: ["Regina George", "Elle Woods", "Cher Horowitz", "Miranda Priestly"],
    likes: ["Being the center of attention", "Designer clothes", "Hot pink", "Compliments", "Parties", "Being envied", "Shopping sprees", "Prom queen crowns"],
    dislikes: ["Cheap clothes", "Being ignored", "Not being invited", "Unflattering photos", "Having to be nice to losers", "Bad hair days", "Generic brands"],
    topFriends: [
      { name: "Jessica", status: "Shopping buddy 🛍️" },
      { name: "Ashley", status: "Gossip partner 👯" },
      { name: "Brittany", status: "Fashion advisor 💄" },
      { name: "Tyler", status: "Arm candy 💪" },
      { name: "Chad", status: "Backup boyfriend 😘" },
      { name: "Tiffany", status: "Competition 😤" }
    ],
    profileSong: "Britney Spears - ...Baby One More Time"
  },

  'the-outcasts': {
    name: "Raven Shadowmere",
    clique: "the-outcasts",
    backgroundColor: "#2c1810",
    backgroundPattern: "stars",
    mood: "Eternal darkness consumes my soul 🖤",
    location: "The Void Between Worlds",
    age: "Immortal (but actually 16)",
    lastLogin: "3:33 AM (the witching hour)",
    profileViews: 666,
    aboutMe: "Greetings, mortals. I am Raven, a creature of the night who dwells in the shadows of this mundane existence. While you sheep follow your petty social constructs, I commune with the darkness that flows through all things. My poetry speaks to the tortured souls who understand TRUE pain. Do not message me unless you can comprehend the beautiful agony of existence. 🦇",
    favoriteQuote: "The light blinds those who refuse to see the beauty in darkness.",
    interests: ["Gothic poetry", "Black magic", "Cemetery walks", "Dark art", "Existential dread", "Vampires", "The occult", "Tim Burton films"],
    music: ["Marilyn Manson", "The Cure", "Nine Inch Nails", "Type O Negative", "Bauhaus", "Siouxsie and the Banshees"],
    movies: ["The Crow", "Interview with the Vampire", "The Nightmare Before Christmas", "Edward Scissorhands", "Donnie Darko", "The Craft"],
    books: ["Edgar Allan Poe", "Anne Rice", "Sylvia Plath", "The Vampire Chronicles", "Gothic poetry collections"],
    heroes: ["Edgar Allan Poe", "Tim Burton", "Robert Smith", "Morticia Addams"],
    likes: ["Midnight", "Black roses", "Gothic architecture", "Rain", "Candles", "Ancient symbols", "Solitude", "The macabre"],
    dislikes: ["Fake goths", "Bright lights", "Cheerfulness", "Conformity", "Small talk", "School spirit", "Happy endings"],
    topFriends: [
      { name: "Damon", status: "Fellow lost soul 💀" },
      { name: "Luna", status: "Witch sister 🌙" },
      { name: "Vlad", status: "Darkness incarnate 🦇" },
      { name: "Sorrow", status: "Pain twin 😢" },
      { name: "Thorn", status: "Poetry critic ✍️" },
      { name: "Shade", status: "Shadow companion 👻" }
    ],
    profileSong: "The Cure - Disintegration"
  },

  'the-jocks': {
    name: "Brad Champion",
    clique: "the-jocks",
    backgroundColor: "#1e3a8a",
    backgroundPattern: "checkers",
    mood: "PUMPED UP AND READY TO WIN! 💪",
    location: "The Gym / Football Field",
    age: "18 and in my PRIME!",
    lastLogin: "Right after practice",
    profileViews: 8934,
    aboutMe: "YO WHAT'S UP EVERYONE! I'm Brad and I'm the CAPTAIN of the football team and basically the strongest guy in school! I live for SPORTS, working out, and WINNING at everything I do! Hit me up if you want to talk about gains, protein shakes, or how awesome I am at every sport ever invented! GO TEAM! 🏈",
    favoriteQuote: "Winners never quit, and quitters never win! NO PAIN, NO GAIN!",
    interests: ["Football", "Basketball", "Wrestling", "Working out", "Protein shakes", "Winning", "Being the best", "Team spirit"],
    music: ["Eminem", "DMX", "Limp Bizkit", "Rage Against the Machine", "Linkin Park", "Drowning Pool"],
    movies: ["Remember the Titans", "The Waterboy", "Any Given Sunday", "Rocky", "Rudy", "Friday Night Lights"],
    books: ["Sports magazines", "Fitness guides", "Playbook strategies", "Do protein powder labels count?"],
    heroes: ["Tom Brady", "Michael Jordan", "The Rock", "Arnold Schwarzenegger"],
    likes: ["Winning", "Touchdowns", "Bench press", "Team bonding", "Energy drinks", "School spirit", "Being captain", "Trophy ceremonies"],
    dislikes: ["Losing", "Weak effort", "Quitters", "Nerds who don't respect sports", "Injury timeouts", "Homework", "Anyone better than me"],
    topFriends: [
      { name: "Mike", status: "Workout buddy 💪" },
      { name: "Steve", status: "Team co-captain 🏈" },
      { name: "Danny", status: "Running back 🏃" },
      { name: "Kyle", status: "Wrestling partner 🤼" },
      { name: "Jake", status: "Gym spotter 🏋️" },
      { name: "Coach", status: "The GOAT 👑" }
    ],
    profileSong: "Eminem - Till I Collapse"
  },

  'the-nerds': {
    name: "Alexander Genius",
    clique: "the-nerds",
    backgroundColor: "#059669",
    backgroundPattern: "checkers",
    mood: "Optimizing life algorithms 🤓",
    location: "The Library / Computer Lab",
    age: "17 (but intellectually 30)",
    lastLogin: "Currently online (always)",
    profileViews: 1337,
    aboutMe: "Salutations! I am Alexander, valedictorian candidate and president of 6 academic clubs. My IQ has been measured at 180+ and I speak 4 programming languages fluently. I enjoy quantum physics, chess tournaments, and correcting people's grammar. If you wish to engage in intellectual discourse, please ensure your arguments are logically sound and properly cited. 📚",
    favoriteQuote: "The only true wisdom is in knowing you know nothing... except I know quite a lot actually.",
    interests: ["Computer programming", "Mathematics", "Science fiction", "Chess", "Academic competitions", "Robotics", "Star Trek", "Debate club"],
    music: ["Classical music", "Video game soundtracks", "Weird Al Yankovic", "They Might Be Giants", "Bach"],
    movies: ["Star Wars", "The Matrix", "Star Trek", "2001: A Space Odyssey", "Back to the Future", "War Games"],
    books: ["Isaac Asimov", "Douglas Adams", "Stephen Hawking", "Textbooks (for fun)", "Programming manuals"],
    heroes: ["Albert Einstein", "Stephen Hawking", "Bill Gates", "Data from Star Trek"],
    likes: ["Perfect test scores", "Solving equations", "Building computers", "Sci-fi conventions", "Academic achievement", "Logic puzzles", "STEM fields"],
    dislikes: ["Sports worship", "Anti-intellectualism", "Grammatical errors", "Illogical arguments", "Social hierarchies", "PE class", "Group projects with slackers"],
    topFriends: [
      { name: "Eugene", status: "Lab partner 🧪" },
      { name: "Shelley", status: "Study group leader 📖" },
      { name: "Martin", status: "Chess rival ♟️" },
      { name: "Diane", status: "Debate partner 🗣️" },
      { name: "Leonard", status: "Code reviewer 💻" },
      { name: "Prof. Chen", status: "Mentor 👨‍🏫" }
    ],
    profileSong: "Weird Al Yankovic - White and Nerdy"
  },

  'the-artists': {
    name: "Luna Moonbeam",
    clique: "the-artists",
    backgroundColor: "#7c3aed",
    backgroundPattern: "flowers",
    mood: "Channeling creative energy ✨🎨",
    location: "The Art Studio / Coffee Shop",
    age: "Ageless like my soul",
    lastLogin: "When inspiration struck",
    profileViews: 4201,
    aboutMe: "Hey beautiful souls! I'm Luna and I see the world through kaleidoscope eyes. Art is my language, color is my voice, and creativity flows through my veins like cosmic energy. I believe everyone has an inner artist waiting to be set free! My paintings have been featured in 3 local galleries and I'm working on my first novel. Let's create something beautiful together! 🌙",
    favoriteQuote: "Art washes away from the soul the dust of everyday life. - Pablo Picasso",
    interests: ["Painting", "Poetry", "Photography", "Creative writing", "Indie music", "Vintage fashion", "Astrology", "Coffee shop culture"],
    music: ["Radiohead", "Björk", "Fiona Apple", "Tori Amos", "Jeff Buckley", "Joni Mitchell"],
    movies: ["Amélie", "Dead Poets Society", "Frida", "Big Fish", "Eternal Sunshine", "Lost in Translation"],
    books: ["Frida Kahlo biography", "Beat poetry", "Art history", "Virginia Woolf", "Sylvia Plath"],
    heroes: ["Frida Kahlo", "Vincent van Gogh", "Georgia O'Keeffe", "David Bowie"],
    likes: ["Sunsets", "Vintage cameras", "Paint-stained fingers", "Open mic nights", "Art galleries", "Deep conversations", "Thrift stores", "Full moons"],
    dislikes: ["Artistic criticism from non-artists", "Mass-produced art", "Boring beige", "Censorship", "Superficiality", "Fast fashion"],
    topFriends: [
      { name: "River", status: "Poetry buddy 📝" },
      { name: "Sage", status: "Gallery partner 🖼️" },
      { name: "Phoenix", status: "Photo model 📸" },
      { name: "Indie", status: "Music collaborator 🎵" },
      { name: "Canvas", status: "Art critic 🎨" },
      { name: "Cosmic", status: "Spiritual guide 🔮" }
    ],
    profileSong: "Radiohead - Creep"
  },

  'the-rebels': {
    name: "Spike Anarchy",
    clique: "the-rebels",
    backgroundColor: "#dc2626",
    backgroundPattern: "stars",
    mood: "FIGHT THE POWER! ✊",
    location: "Wherever authority isn't",
    age: "Old enough to know better",
    lastLogin: "After detention",
    profileViews: 2187,
    aboutMe: "Listen up, conformists! I'm Spike and I don't follow ANYONE'S rules. This whole system is rigged and I'm here to tear it down! School is prison, homework is slavery, and dress codes are fascism! If you can't handle the TRUTH then keep scrolling, sheep! Real recognize real and I only roll with people who aren't afraid to stand up and FIGHT! 🔥",
    favoriteQuote: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
    interests: ["Anarchy", "Punk music", "Skateboarding", "Graffiti art", "Protest movements", "Anti-establishment", "Breaking rules", "Leather jackets"],
    music: ["The Clash", "Sex Pistols", "Dead Kennedys", "Black Flag", "Minor Threat", "Bad Religion"],
    movies: ["Fight Club", "SLC Punk!", "The Warriors", "Trainspotting", "A Clockwork Orange", "Natural Born Killers"],
    books: ["1984", "The Anarchist Cookbook", "On the Road", "Catcher in the Rye", "Anything banned"],
    heroes: ["Che Guevara", "Malcolm X", "Johnny Rotten", "Tyler Durden"],
    likes: ["Chaos", "Freedom", "Loud music", "Shocking people", "Breaking curfew", "Detention", "Being different", "Anarchy symbols"],
    dislikes: ["Authority", "Rules", "Dress codes", "The establishment", "Sellouts", "Conformity", "School spirit", "Being told what to do"],
    topFriends: [
      { name: "Riot", status: "Partner in crime 💀" },
      { name: "Chaos", status: "Anarchy ally ⚡" },
      { name: "Vex", status: "Rebel sister 👊" },
      { name: "Crash", status: "Skate crew 🛹" },
      { name: "Storm", status: "Protest buddy ✊" },
      { name: "Zero", status: "Rule breaker 🚫" }
    ],
    profileSong: "The Clash - London Calling"
  }
};