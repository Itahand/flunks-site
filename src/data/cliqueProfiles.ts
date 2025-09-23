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
  'the-preps': {
    name: "",
    clique: "the-preps",
    backgroundColor: "#1e3a8a",
    backgroundPattern: "glitter",
    mood: "Living my best life 🏌️‍♂️",
    location: "The Country Club / Tennis Courts",
    age: "17 (trust fund kid since birth)",
    lastLogin: "Between polo practice and yacht club",
    profileViews: 23847,
    aboutMe: "Greetings, fellow members of high society! I'm fortunate enough to be the heir to my parents' fortune and the most distinguished gentleman in this town. When I'm not dominating at polo or perfecting my tennis serve at the country club, I'm setting trends that lesser mortals will follow next season. My 24-karat gold braces aren't just dental work - they're a statement! I was influencing people before 'influencer' was even a word, darling. If you're not on the social register, we probably shouldn't associate. TTYL! ��✨",
    favoriteQuote: "Money talks, but wealth whispers... and I'm practically silent.",
    interests: ["Polo", "Tennis", "Golf", "Yacht racing", "Country club events", "Stock market", "Fine dining", "Social networking", "Trend setting"],
    music: ["Boyz II Men", "TLC", "Alanis Morissette", "Celine Dion", "Whitney Houston", "Mariah Carey", "Ace of Base", "All-4-One"],
    movies: ["Titanic", "My Best Friend's Wedding", "The Full Monty", "Good Will Hunting", "As Good as It Gets", "Jerry Maguire", "Scream", "The English Patient"],
    books: ["The Art of the Deal", "Forbes Magazine", "Town & Country", "GQ", "Vanity Fair", "The Great Gatsby", "Investment guides"],
    heroes: ["Gordon Gekko", "Jay Gatsby", "Donald Trump", "Ralph Lauren", "Tommy Hilfiger"],
    likes: ["24k gold accessories", "Designer everything", "Country club memberships", "Trust fund statements", "Being photographed", "Exclusive events", "Name dropping", "Premium everything"],
    dislikes: ["Public transportation", "Generic brands", "Waiting in lines", "People who don't know my family", "Anything less than first class", "Scholarship kids", "Off-brand anything"],
    topFriends: [
      { name: "Muffy", status: "Debutante ball date 💃" },
      { name: "Flunko", status: "Cool gaming buddy �" },
      { name: "Buffy", status: "Tennis partner 🎾" },
      { name: "Skip", status: "Yacht club buddy ⛵" },
      { name: "Tiffany", status: "Shopping consultant 💎" },
      { name: "Thurston", status: "Investment advisor 💰" }
    ],
    profileSong: "Boyz II Men - I'll Make Love to You"
  },

  'the-freaks': {
    name: "Raven Shadowmere",
    clique: "the-freaks",
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
    aboutMe: "Salutations! I'm a proud hall monitor at FHS and valedictorian candidate and president of 6 academic clubs. My IQ has been measured at 180+ and I speak 4 programming languages fluently. I spend most of my free time at the local arcade mastering Street Fighter II and Mortal Kombat - my high scores are legendary! When I'm not gaming, I enjoy quantum physics, chess tournaments, and correcting people's grammar. The arcade is my sanctuary where quarters flow like water and I reign supreme at Pac-Man and Galaga! If you wish to engage in intellectual discourse, please ensure your arguments are logically sound and properly cited. 📚🕹️",
    favoriteQuote: "The only true wisdom is in knowing you know nothing... except I know quite a lot actually.",
    interests: ["Computer programming", "Mathematics", "Science fiction", "Chess", "Academic competitions", "Robotics", "Power Rangers", "Debate club"],
    music: ["Classical music", "Video game soundtracks", "Weird Al Yankovic", "Peruvian flute music"],
    movies: ["Revenge of the Nerds", "The Matrix", "Jurassic Park", "The Goonies", "Back to the Future", "War Games"],
    books: ["Video game guides", "Comic books", "Stephen Hawking", "Textbooks (for fun)", "Programming manuals"],
    heroes: ["Albert Einstein", "Stephen Hawking", "Bill Gates", "Anthony Michael Hall"],
    likes: ["Perfect test scores", "Solving equations", "Building computers", "Sci-fi conventions", "Academic achievement", "Logic puzzles", "STEM fields"],
    dislikes: ["Sports worship", "Anti-intellectualism", "Grammatical errors", "Illogical arguments", "Social hierarchies", "PE class", "Group projects with slackers"],
    topFriends: [
      { name: "Eugene", status: "Lab partner 🧪" },
      { name: "Shelley", status: "Study group leader 📖" },
      { name: "Flunko", status: "Chess rival ♟️" },
      { name: "Diane", status: "Debate partner 🗣️" },
      { name: "Leonard", status: "Code reviewer 💻" },
      { name: "Prof. Chen", status: "Mentor 👨‍🏫" }
    ],
    profileSong: "The Offspring - Pretty Fly (For a White Guy)"
  },

  "flunko": {
    name: "Flunko",
    clique: "flunko",
    backgroundColor: "#DC143C",
    backgroundPattern: BACKGROUND_PATTERNS.hearts,
    mood: "Chillin' like a villain 😎",
    location: "Arcade / My basement",
    age: "17 (but wise beyond my years)",
    lastLogin: "Currently online (always)",
    profileViews: 2847,
    aboutMe: "What's up everyone! I'm just a chill dude who loves the finer things in life - video games, good movies, and appreciating beautiful women. I spend most of my time at the arcade perfecting my Street Fighter combos or jamming on my guitar. Life's too short to stress about the small stuff, so I just go with the flow and enjoy the ride. Looking for fellow cool cats who appreciate the art of relaxation and good times! 🎮🎸",
    favoriteQuote: "The dude abides, man.",
    interests: ["Video games", "Guitar playing", "Arcade culture", "Movie marathons", "Chill music", "Photography", "Skateboarding", "Comic books"],
    music: ["Nirvana", "Stone Temple Pilots", "Soundgarden", "Pearl Jam", "Red Hot Chili Peppers", "Sublime", "Bush", "Alice in Chains"],
    movies: ["Fight Club", "Donnie Darko", "Caddyshack", "The Big Lebowski", "Pulp Fiction", "Dumb and Dumber", "Point Break", "Wayne's World"],
    books: ["Fight Club", "On the Road", "The Catcher in the Rye", "High Fidelity", "Less Than Zero", "Generation X", "Video game magazines"],
    heroes: ["The Dude", "Tyler Durden", "Ferris Bueller", "Jeff Spicoli", "Bill & Ted"],
    likes: ["Arcade high scores", "Guitar solos", "Cult movies", "Chill vibes", "Good friends", "Late night gaming", "90s culture"],
    dislikes: ["Drama", "Uptight people", "Mainstream conformity", "Early mornings", "Authority figures", "Stress", "Fake people"],
    topFriends: [
      { name: "Casey", status: "Gaming buddy 🎮" },
      { name: "Drew", status: "Guitar jamming partner 🎸" },
      { name: "Alex", status: "Movie night regular 🎬" },
      { name: "Jordan", status: "Arcade rival 👾" },
      { name: "Sam", status: "Chill companion 😎" },
      { name: "Taylor", status: "Fellow slacker 🏄‍♂️" }
    ],
    profileSong: "Stone Temple Pilots - Interstate Love Song"
  }
};
