import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  Brain,
  Check,
  ChevronDown,
  CreditCard,
  Gamepad2,
  ImageIcon,
  Menu,
  Rocket,
  Shield,
  Star,
  Trophy,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// ============================================================
// SESSION ID
// ============================================================
function getSessionId(): string {
  let sid = sessionStorage.getItem("ag_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("ag_session_id", sid);
  }
  return sid;
}

const SESSION_ID = getSessionId();

// ============================================================
// GAME DATABASE (55 games)
// ============================================================
type Genre =
  | "Action"
  | "Horror"
  | "Racing"
  | "Puzzle"
  | "Simulation"
  | "Escape"
  | "Parkour"
  | "Funny";

interface Game {
  id: number;
  name: string;
  genre: Genre;
  description: string;
  tags: string[];
  releaseYear: number;
  rating: number;
}

const GAME_DATABASE: Game[] = [
  // ACTION
  {
    id: 1,
    name: "Cyberpunk Assault",
    genre: "Action",
    description:
      "A futuristic hack-and-slash through neon-lit mega cities. Intense combat with cyber-augmented enemies.",
    tags: ["action", "fight", "cyberpunk", "intense", "combat", "fast"],
    releaseYear: 2023,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Battlefield Horizon",
    genre: "Action",
    description:
      "Epic military shooter with massive online battlefields, tactical team play, and explosive warfare.",
    tags: ["action", "shoot", "war", "multiplayer", "battle", "team"],
    releaseYear: 2022,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Shadow Strike Elite",
    genre: "Action",
    description:
      "Stealthy assassination missions across 20 global cities. Master gadgets and martial arts.",
    tags: ["action", "stealth", "adventure", "combat", "fight", "missions"],
    releaseYear: 2023,
    rating: 4.3,
  },
  {
    id: 4,
    name: "Galactic Warriors",
    genre: "Action",
    description:
      "Space combat RPG with epic battles, alien worlds and customizable warships.",
    tags: ["action", "space", "battle", "rpg", "adventure", "combat"],
    releaseYear: 2022,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Street Combat Legends",
    genre: "Action",
    description:
      "Classic 2D street fighting reborn in HD. Master 30+ unique fighters with combo systems.",
    tags: ["action", "fight", "combat", "multiplayer", "fast", "pvp"],
    releaseYear: 2021,
    rating: 4.4,
  },
  {
    id: 6,
    name: "Dragon Slayer Chronicles",
    genre: "Action",
    description:
      "Hack and slash fantasy adventure with massive boss battles and epic loot drops.",
    tags: ["action", "adventure", "fantasy", "combat", "boss", "loot"],
    releaseYear: 2023,
    rating: 4.7,
  },
  {
    id: 7,
    name: "Turbo Force Arena",
    genre: "Action",
    description:
      "High-speed arena shooter with jetpacks, wall-running and explosive power-ups.",
    tags: ["action", "fast", "shoot", "arena", "intense", "multiplayer"],
    releaseYear: 2022,
    rating: 4.2,
  },
  // HORROR
  {
    id: 8,
    name: "Whispering Shadows",
    genre: "Horror",
    description:
      "Psychological horror in an abandoned asylum. Solve dark mysteries while evading a relentless entity.",
    tags: ["horror", "scary", "dark", "mystery", "ghost", "terror", "creepy"],
    releaseYear: 2023,
    rating: 4.7,
  },
  {
    id: 9,
    name: "Dead Reckoning",
    genre: "Horror",
    description:
      "Zombie survival in a post-apocalyptic city. Scavenge, craft, and survive the undead horde.",
    tags: ["horror", "zombie", "survival", "dark", "creepy", "fear"],
    releaseYear: 2022,
    rating: 4.5,
  },
  {
    id: 10,
    name: "The Haunting at Blackwood",
    genre: "Horror",
    description:
      "Victorian ghost story with branching narrative. Every choice affects who survives the night.",
    tags: ["horror", "ghost", "scary", "story", "dark", "atmosphere", "terror"],
    releaseYear: 2021,
    rating: 4.6,
  },
  {
    id: 11,
    name: "Crimson Pact",
    genre: "Horror",
    description:
      "Occult horror with demonic puzzles and a terrifying ritual system. Can you escape the cult?",
    tags: ["horror", "dark", "creepy", "puzzle", "mystery", "fear", "escape"],
    releaseYear: 2023,
    rating: 4.3,
  },
  {
    id: 12,
    name: "Void Crawler",
    genre: "Horror",
    description:
      "Deep-space survival horror aboard a derelict station. Alien creatures hunt by sound and movement.",
    tags: ["horror", "survival", "space", "scary", "intense", "fear", "dark"],
    releaseYear: 2022,
    rating: 4.8,
  },
  {
    id: 13,
    name: "Night Terrors",
    genre: "Horror",
    description:
      "First-person nightmare exploration where the environment shifts and reality breaks down.",
    tags: ["horror", "terror", "scary", "dark", "creepy", "fear", "ghost"],
    releaseYear: 2022,
    rating: 4.4,
  },
  // RACING
  {
    id: 14,
    name: "Neon Raceway 2077",
    genre: "Racing",
    description:
      "Futuristic anti-gravity racing on holographic circuits. Push 600 km/h on vertical loop tracks.",
    tags: ["racing", "race", "fast", "speed", "futuristic", "track", "vehicle"],
    releaseYear: 2023,
    rating: 4.6,
  },
  {
    id: 15,
    name: "Drift Kings Online",
    genre: "Racing",
    description:
      "Style-based drift racing championship. Score points for precision drifts and near-miss overtakes.",
    tags: ["racing", "drift", "car", "drive", "speed", "track", "multiplayer"],
    releaseYear: 2022,
    rating: 4.5,
  },
  {
    id: 16,
    name: "Rally World Championship",
    genre: "Racing",
    description:
      "Authentic rally racing across ice, mud, and gravel stages. The most realistic car physics.",
    tags: ["racing", "race", "car", "drive", "vehicle", "realistic", "track"],
    releaseYear: 2021,
    rating: 4.4,
  },
  {
    id: 17,
    name: "Superbike Thunder",
    genre: "Racing",
    description:
      "High-octane motorcycle racing on world-famous circuits. 60 licensed bikes, full customization.",
    tags: ["racing", "fast", "speed", "vehicle", "track", "drive", "bike"],
    releaseYear: 2023,
    rating: 4.3,
  },
  {
    id: 18,
    name: "Street Heat Underground",
    genre: "Racing",
    description:
      "Illegal street racing in a massive open-world city. Tune your car, evade cops, win the crown.",
    tags: ["racing", "car", "drive", "speed", "drift", "open world", "track"],
    releaseYear: 2022,
    rating: 4.7,
  },
  {
    id: 19,
    name: "Monster Truck Mayhem",
    genre: "Racing",
    description:
      "Crush cars and obstacles in massive stadium arenas. Physics-based destruction racing.",
    tags: ["racing", "vehicle", "fun", "fast", "funny", "action", "speed"],
    releaseYear: 2021,
    rating: 4.2,
  },
  // PUZZLE
  {
    id: 20,
    name: "Quantum Mind",
    genre: "Puzzle",
    description:
      "Mind-bending physics puzzles in a quantum realm. Manipulate time, gravity, and dimensions.",
    tags: [
      "puzzle",
      "think",
      "logic",
      "brain",
      "mind",
      "solve",
      "casual",
      "relax",
    ],
    releaseYear: 2023,
    rating: 4.8,
  },
  {
    id: 21,
    name: "Mosaic Dreams",
    genre: "Puzzle",
    description:
      "Artistically rich tile-matching adventure with a beautiful story woven through each level.",
    tags: [
      "puzzle",
      "casual",
      "relax",
      "chill",
      "story",
      "brain",
      "logic",
      "calm",
    ],
    releaseYear: 2022,
    rating: 4.6,
  },
  {
    id: 22,
    name: "Logic Gates",
    genre: "Puzzle",
    description:
      "Program real circuits using drag-and-drop logic gates. Surprisingly deep and rewarding.",
    tags: ["puzzle", "logic", "brain", "solve", "strategy", "mind", "tech"],
    releaseYear: 2021,
    rating: 4.5,
  },
  {
    id: 23,
    name: "Portal Paradox",
    genre: "Puzzle",
    description:
      "Create wormholes to navigate impossible environments. Over 100 handcrafted chambers.",
    tags: ["puzzle", "think", "solve", "logic", "brain", "mind", "strategy"],
    releaseYear: 2023,
    rating: 4.9,
  },
  {
    id: 24,
    name: "Word Weaver",
    genre: "Puzzle",
    description:
      "Creative wordplay puzzle game. Build chains of words, unlock new realms with language.",
    tags: [
      "puzzle",
      "casual",
      "brain",
      "relax",
      "chill",
      "calm",
      "word",
      "logic",
    ],
    releaseYear: 2022,
    rating: 4.3,
  },
  {
    id: 25,
    name: "Gravity Shift",
    genre: "Puzzle",
    description:
      "Flip gravity to navigate mazes from multiple perspectives. Elegant minimalist design.",
    tags: ["puzzle", "logic", "think", "solve", "brain", "casual", "relax"],
    releaseYear: 2021,
    rating: 4.4,
  },
  // SIMULATION
  {
    id: 26,
    name: "City Architect Pro",
    genre: "Simulation",
    description:
      "Build and manage a sprawling metropolis from a tiny village. Advanced economic simulation.",
    tags: [
      "simulation",
      "sim",
      "build",
      "manage",
      "city",
      "relax",
      "chill",
      "calm",
      "strategy",
    ],
    releaseYear: 2023,
    rating: 4.7,
  },
  {
    id: 27,
    name: "Farm Frontier",
    genre: "Simulation",
    description:
      "Restore your grandfather's farm to glory. Plant crops, raise animals, marry a neighbor.",
    tags: [
      "simulation",
      "farm",
      "life",
      "relax",
      "chill",
      "calm",
      "build",
      "manage",
      "sim",
    ],
    releaseYear: 2022,
    rating: 4.8,
  },
  {
    id: 28,
    name: "Ocean Empire",
    genre: "Simulation",
    description:
      "Build underwater cities, manage submarine fleets, and research deep-sea technologies.",
    tags: [
      "simulation",
      "build",
      "manage",
      "chill",
      "relax",
      "calm",
      "sim",
      "strategy",
      "ocean",
    ],
    releaseYear: 2021,
    rating: 4.5,
  },
  {
    id: 29,
    name: "Space Colony",
    genre: "Simulation",
    description:
      "Establish a human colony on Mars. Balance resources, morale, and alien discoveries.",
    tags: [
      "simulation",
      "sim",
      "build",
      "manage",
      "space",
      "strategy",
      "relax",
      "life",
    ],
    releaseYear: 2023,
    rating: 4.6,
  },
  {
    id: 30,
    name: "Restaurant Rush",
    genre: "Simulation",
    description:
      "Build a culinary empire from a food truck to a Michelin-starred restaurant.",
    tags: [
      "simulation",
      "manage",
      "build",
      "relax",
      "chill",
      "sim",
      "life",
      "fun",
    ],
    releaseYear: 2022,
    rating: 4.4,
  },
  {
    id: 31,
    name: "Life Simulator 3",
    genre: "Simulation",
    description:
      "Live a full virtual life. Choose careers, relationships, raise children, leave a legacy.",
    tags: [
      "simulation",
      "life",
      "sim",
      "relax",
      "chill",
      "story",
      "calm",
      "manage",
    ],
    releaseYear: 2023,
    rating: 4.3,
  },
  // ESCAPE
  {
    id: 32,
    name: "The Last Cipher",
    genre: "Escape",
    description:
      "Trapped in a Cold War bunker with 60 minutes to decrypt nuclear codes. High tension escape.",
    tags: [
      "escape",
      "room",
      "mystery",
      "clue",
      "puzzle",
      "detective",
      "solve",
      "adventure",
    ],
    releaseYear: 2023,
    rating: 4.7,
  },
  {
    id: 33,
    name: "Phantom Gallery",
    genre: "Escape",
    description:
      "Locked in a haunted art museum overnight. Uncover the artist's dark secret to escape.",
    tags: [
      "escape",
      "mystery",
      "ghost",
      "room",
      "clue",
      "adventure",
      "story",
      "horror",
    ],
    releaseYear: 2022,
    rating: 4.5,
  },
  {
    id: 34,
    name: "Time Vault",
    genre: "Escape",
    description:
      "Solve temporal puzzles across multiple eras to unlock a time-locked chamber.",
    tags: [
      "escape",
      "puzzle",
      "mystery",
      "room",
      "clue",
      "adventure",
      "think",
      "solve",
    ],
    releaseYear: 2021,
    rating: 4.6,
  },
  {
    id: 35,
    name: "Deep Station Omega",
    genre: "Escape",
    description:
      "Abandoned underwater research facility. Restore power and escape before the oxygen runs out.",
    tags: [
      "escape",
      "mystery",
      "clue",
      "adventure",
      "solve",
      "room",
      "survival",
      "horror",
    ],
    releaseYear: 2023,
    rating: 4.4,
  },
  {
    id: 36,
    name: "Detective Agency Files",
    genre: "Escape",
    description:
      "Play as a detective solving interconnected escape rooms that tell a compelling murder mystery.",
    tags: [
      "escape",
      "detective",
      "mystery",
      "clue",
      "adventure",
      "story",
      "solve",
      "room",
    ],
    releaseYear: 2022,
    rating: 4.8,
  },
  // PARKOUR
  {
    id: 37,
    name: "Mirror's Leap",
    genre: "Parkour",
    description:
      "Fluid first-person parkour through a shattered futuristic city. Master momentum and flow.",
    tags: [
      "parkour",
      "run",
      "jump",
      "movement",
      "fast",
      "platform",
      "free",
      "roam",
      "climb",
    ],
    releaseYear: 2023,
    rating: 4.8,
  },
  {
    id: 38,
    name: "Rooftop Runner",
    genre: "Parkour",
    description:
      "Free-running across urban rooftops. Perform acrobatics, solve platforming challenges.",
    tags: [
      "parkour",
      "run",
      "jump",
      "roam",
      "free",
      "climb",
      "movement",
      "platform",
    ],
    releaseYear: 2022,
    rating: 4.6,
  },
  {
    id: 39,
    name: "Wall Dancer",
    genre: "Parkour",
    description:
      "Stylized wall-running platformer inspired by martial arts films. Gravity-defying movement.",
    tags: [
      "parkour",
      "jump",
      "run",
      "platform",
      "movement",
      "climb",
      "free",
      "action",
    ],
    releaseYear: 2021,
    rating: 4.5,
  },
  {
    id: 40,
    name: "Velocity Rush",
    genre: "Parkour",
    description:
      "Ultra-fast speed-running through procedurally generated obstacle courses. Pure adrenaline.",
    tags: [
      "parkour",
      "run",
      "fast",
      "jump",
      "movement",
      "platform",
      "speed",
      "intense",
    ],
    releaseYear: 2023,
    rating: 4.7,
  },
  {
    id: 41,
    name: "Sky Dancer",
    genre: "Parkour",
    description:
      "Jump between floating sky islands with grappling hooks and gliders. Serene yet challenging.",
    tags: [
      "parkour",
      "jump",
      "platform",
      "movement",
      "climb",
      "roam",
      "free",
      "chill",
    ],
    releaseYear: 2022,
    rating: 4.4,
  },
  // FUNNY
  {
    id: 42,
    name: "Totally Unhinged",
    genre: "Funny",
    description:
      "Ragdoll physics chaos game. Complete hilariously impossible tasks with zero coordination required.",
    tags: [
      "funny",
      "comedy",
      "laugh",
      "silly",
      "fun",
      "weird",
      "casual",
      "humour",
      "ragdoll",
    ],
    releaseYear: 2023,
    rating: 4.9,
  },
  {
    id: 43,
    name: "Goat Mayhem",
    genre: "Funny",
    description:
      "Play as a goat causing maximum chaos in suburban neighborhoods. Hilarious destruction physics.",
    tags: [
      "funny",
      "silly",
      "laugh",
      "comedy",
      "weird",
      "fun",
      "humour",
      "casual",
    ],
    releaseYear: 2021,
    rating: 4.7,
  },
  {
    id: 44,
    name: "Clumsy Chef",
    genre: "Funny",
    description:
      "Control an absurdly uncoordinated chef in a restaurant. Fail spectacularly, serve impossible dishes.",
    tags: [
      "funny",
      "comedy",
      "casual",
      "laugh",
      "silly",
      "fun",
      "humour",
      "weird",
    ],
    releaseYear: 2022,
    rating: 4.6,
  },
  {
    id: 45,
    name: "Alien Idiots",
    genre: "Funny",
    description:
      "Co-op comedy about aliens trying to understand humans. Wildly incorrect interpretations.",
    tags: [
      "funny",
      "comedy",
      "laugh",
      "silly",
      "multiplayer",
      "fun",
      "weird",
      "casual",
      "humour",
    ],
    releaseYear: 2023,
    rating: 4.8,
  },
  {
    id: 46,
    name: "Noodle Arms",
    genre: "Funny",
    description:
      "Floppy arm fighting game with unpredictable ragdoll physics. Party game perfection.",
    tags: [
      "funny",
      "silly",
      "laugh",
      "fun",
      "multiplayer",
      "party",
      "casual",
      "humour",
      "weird",
    ],
    releaseYear: 2022,
    rating: 4.7,
  },
  {
    id: 47,
    name: "Wizard Fail School",
    genre: "Funny",
    description:
      "Attend a magic school where every spell goes catastrophically wrong. Collect failure badges.",
    tags: [
      "funny",
      "comedy",
      "casual",
      "laugh",
      "silly",
      "fun",
      "humour",
      "weird",
    ],
    releaseYear: 2023,
    rating: 4.5,
  },
  // Additional
  {
    id: 48,
    name: "Neon Samurai",
    genre: "Action",
    description:
      "Katana-based action game in feudal Japan meets neon cyberpunk. Lethal slow-motion combat.",
    tags: [
      "action",
      "combat",
      "fight",
      "fast",
      "intense",
      "adventure",
      "samurai",
    ],
    releaseYear: 2022,
    rating: 4.9,
  },
  {
    id: 49,
    name: "Echoes of Despair",
    genre: "Horror",
    description:
      "Silent hill-inspired psychological horror. Face manifestations of protagonist's deepest fears.",
    tags: [
      "horror",
      "scary",
      "dark",
      "creepy",
      "fear",
      "psychological",
      "terror",
      "mystery",
    ],
    releaseYear: 2021,
    rating: 4.6,
  },
  {
    id: 50,
    name: "Cosmic Architect",
    genre: "Simulation",
    description:
      "Build and manage entire solar systems. Design alien life and guide civilizational evolution.",
    tags: [
      "simulation",
      "build",
      "manage",
      "space",
      "chill",
      "relax",
      "calm",
      "strategy",
      "sim",
    ],
    releaseYear: 2023,
    rating: 4.7,
  },
  {
    id: 51,
    name: "Pixel Dungeon Tactics",
    genre: "Puzzle",
    description:
      "Turn-based tactical puzzler in a retro dungeon. Every move counts. Plan or perish.",
    tags: [
      "puzzle",
      "strategy",
      "logic",
      "think",
      "brain",
      "solve",
      "rpg",
      "mind",
    ],
    releaseYear: 2022,
    rating: 4.5,
  },
  {
    id: 52,
    name: "Escape From Echo Island",
    genre: "Escape",
    description:
      "Deserted island escape with survivalist puzzles. Decode ancient ruins to call for rescue.",
    tags: [
      "escape",
      "mystery",
      "clue",
      "puzzle",
      "adventure",
      "solve",
      "story",
      "survive",
    ],
    releaseYear: 2021,
    rating: 4.4,
  },
  {
    id: 53,
    name: "Hyper Rail",
    genre: "Racing",
    description:
      "Magnetic rail racing at impossible speeds. Shortest tracks, highest stakes, pure reflex.",
    tags: ["racing", "fast", "speed", "track", "vehicle", "intense", "race"],
    releaseYear: 2023,
    rating: 4.5,
  },
  {
    id: 54,
    name: "Banana Bonanza",
    genre: "Funny",
    description:
      "Monkeys vs. robots comedy battle. Absurd physics and slapstick humor in every level.",
    tags: [
      "funny",
      "comedy",
      "laugh",
      "silly",
      "fun",
      "casual",
      "humour",
      "weird",
    ],
    releaseYear: 2022,
    rating: 4.6,
  },
  {
    id: 55,
    name: "Free Runner X",
    genre: "Parkour",
    description:
      "Online competitive parkour races. Beat world records on shared maps, design your own courses.",
    tags: [
      "parkour",
      "run",
      "jump",
      "fast",
      "movement",
      "multiplayer",
      "platform",
      "climb",
      "free",
    ],
    releaseYear: 2023,
    rating: 4.6,
  },
];

// ============================================================
// GENRE KEYWORD MAP
// ============================================================
const GENRE_KEYWORDS: Record<Genre, string[]> = {
  Action: [
    "action",
    "fight",
    "fast",
    "combat",
    "battle",
    "shoot",
    "war",
    "adventure",
    "intense",
    "explosive",
  ],
  Horror: [
    "horror",
    "scary",
    "fear",
    "dark",
    "ghost",
    "zombie",
    "creepy",
    "survival",
    "terror",
    "haunted",
    "spooky",
  ],
  Racing: [
    "racing",
    "race",
    "car",
    "speed",
    "drive",
    "track",
    "fast",
    "vehicle",
    "drift",
    "motorcycle",
  ],
  Puzzle: [
    "puzzle",
    "think",
    "logic",
    "brain",
    "solve",
    "strategy",
    "mind",
    "casual",
    "relaxing",
    "chill",
    "calm",
  ],
  Simulation: [
    "simulate",
    "sim",
    "build",
    "manage",
    "city",
    "farm",
    "life",
    "relax",
    "chill",
    "calm",
    "relaxing",
    "peaceful",
  ],
  Escape: [
    "escape",
    "room",
    "mystery",
    "clue",
    "detective",
    "adventure",
    "story",
    "solve",
  ],
  Parkour: [
    "parkour",
    "run",
    "jump",
    "free",
    "roam",
    "movement",
    "platform",
    "climb",
    "freerun",
  ],
  Funny: [
    "funny",
    "comedy",
    "laugh",
    "silly",
    "fun",
    "weird",
    "humour",
    "humor",
    "casual",
    "hilarious",
  ],
};

interface GameMatch {
  game: Game;
  score: number;
  whyMatches: string;
}

function suggestGames(input: string): GameMatch[] {
  const tokens = input
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2);

  const expandedTokens = [...tokens];
  if (
    tokens.some((t) =>
      ["relax", "calm", "chill", "peaceful", "relaxing", "stress"].includes(t),
    )
  ) {
    expandedTokens.push("simulation", "puzzle", "chill", "calm");
  }
  if (
    tokens.some((t) =>
      ["multiplayer", "online", "friends", "together"].includes(t),
    )
  ) {
    expandedTokens.push("multiplayer");
  }
  if (
    tokens.some((t) =>
      ["anime", "rpg", "story", "narrative", "plot"].includes(t),
    )
  ) {
    expandedTokens.push("adventure", "story", "rpg");
  }
  if (
    tokens.some((t) =>
      ["scary", "spooky", "creepy", "terrify", "fear", "fright"].includes(t),
    )
  ) {
    expandedTokens.push("horror", "dark", "ghost");
  }

  const scored = GAME_DATABASE.map((game) => {
    let score = 0;
    const reasons: string[] = [];

    for (const tag of game.tags) {
      if (expandedTokens.some((t) => tag.includes(t) || t.includes(tag))) {
        score += 2;
      }
    }

    const genreKws = GENRE_KEYWORDS[game.genre] || [];
    for (const kw of genreKws) {
      if (expandedTokens.some((t) => kw.includes(t) || t.includes(kw))) {
        score += 1;
      }
    }

    const nameWords = game.name.toLowerCase().split(/\s+/);
    for (const nw of nameWords) {
      if (expandedTokens.some((t) => nw.includes(t) || t.includes(nw))) {
        score += 3;
      }
    }

    if (score > 0) {
      const matchedKeywords = expandedTokens
        .filter(
          (t) =>
            game.tags.some((tag) => tag.includes(t) || t.includes(tag)) ||
            genreKws.some((kw) => kw.includes(t) || t.includes(kw)),
        )
        .slice(0, 3);
      if (matchedKeywords.length > 0) {
        reasons.push(`Matches your interest in: ${matchedKeywords.join(", ")}`);
      }
      reasons.push(`${game.genre} genre fits your preferences perfectly`);
    }

    return {
      game,
      score,
      whyMatches:
        reasons.join(". ") || `Great ${game.genre} game recommended for you`,
    };
  });

  return scored
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || b.game.rating - a.game.rating)
    .slice(0, 5);
}

// ============================================================
// GENRE BADGE COLORS
// ============================================================
const GENRE_COLORS: Record<Genre, string> = {
  Action: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Horror: "bg-red-900/30 text-red-300 border-red-700/40",
  Racing: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Puzzle: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Simulation: "bg-green-500/20 text-green-300 border-green-500/30",
  Escape: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Parkour: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Funny: "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

// ============================================================
// STAR RATING COMPONENT
// ============================================================
interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const sizeClasses = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

  return (
    <div className="flex gap-1" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-all duration-150 ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            aria-label={`${star} star`}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                filled
                  ? "fill-[oklch(0.82_0.18_85)] text-[oklch(0.82_0.18_85)]"
                  : "fill-transparent text-muted-foreground/40"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// FEATURED GAME CARDS
// ============================================================
const FEATURED_GAMES = [
  {
    game: GAME_DATABASE[0],
    img: "/assets/generated/game-action.dim_400x280.jpg",
  },
  {
    game: GAME_DATABASE[7],
    img: "/assets/generated/game-horror.dim_400x280.jpg",
  },
  {
    game: GAME_DATABASE[13],
    img: "/assets/generated/game-racing.dim_400x280.jpg",
  },
];

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  const { actor } = useActor();

  // Navigation state
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // AI Suggester
  const [suggestionInput, setSuggestionInput] = useState("");
  const [suggestions, setSuggestions] = useState<GameMatch[]>([]);
  const [suggestionCount, setSuggestionCount] = useState(0);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Rating
  const [selectedStars, setSelectedStars] = useState(0);
  const [modalStars, setModalStars] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [numRatings, setNumRatings] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  // Upload
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscription
  const [subscribing, setSubscribing] = useState(false);

  // Load stats on mount
  useEffect(() => {
    if (!actor) return;
    actor
      .getRatingStats()
      .then(({ averageRating, numRatings: nr }) => {
        setAvgRating(Number(averageRating) / 100);
        setNumRatings(Number(nr));
      })
      .catch(() => {});
    actor
      .canUploadImage(SESSION_ID)
      .then(({ count }) => setUploadCount(Number(count)))
      .catch(() => {});
  }, [actor]);

  // Scroll section tracking
  useEffect(() => {
    const sections = ["home", "suggester", "upload", "pricing", "ratings"];
    const handleScroll = () => {
      const scrollY = window.scrollY + 100;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (
          el &&
          el.offsetTop <= scrollY &&
          el.offsetTop + el.offsetHeight > scrollY
        ) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  // Game suggestions
  const handleGetSuggestions = useCallback(() => {
    if (!suggestionInput.trim()) return;
    setIsLoadingSuggestions(true);
    setTimeout(() => {
      const results = suggestGames(suggestionInput);
      setSuggestions(results);
      const newCount = suggestionCount + 1;
      setSuggestionCount(newCount);
      if (newCount % 3 === 0) {
        setTimeout(() => setShowRatingModal(true), 600);
      }
      setIsLoadingSuggestions(false);
    }, 800);
  }, [suggestionInput, suggestionCount]);

  // Image upload
  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (uploadCount >= 5) {
        toast.error("Daily limit reached. Come back tomorrow!");
        return;
      }

      if (actor) {
        const check = await actor.canUploadImage(SESSION_ID).catch(() => null);
        if (check && !check.allowed) {
          toast.error("Daily upload limit reached. Come back tomorrow!");
          setUploadCount(Number(check.count));
          return;
        }
      }

      const toProcess = Math.min(files.length, 5 - uploadCount);
      let newCount = uploadCount;
      const newPreviews: string[] = [];

      for (let i = 0; i < toProcess; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        if (actor) {
          const res = await actor
            .recordImageUpload(SESSION_ID)
            .catch(() => null);
          if (res) {
            newCount = Number(res.count);
            newPreviews.push(URL.createObjectURL(file));
            if (!res.allowed) break;
            continue;
          }
        }
        newPreviews.push(URL.createObjectURL(file));
        newCount = Math.min(newCount + 1, 5);
      }

      setUploadCount(newCount);
      setUploadedImages((prev) => [...prev, ...newPreviews].slice(0, 5));
      if (newPreviews.length > 0) {
        toast.success(
          `${newPreviews.length} image${newPreviews.length > 1 ? "s" : ""} uploaded!`,
        );
      }
    },
    [actor, uploadCount],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  // Rating submit
  const submitRating = useCallback(
    async (stars: number, fromModal: boolean) => {
      if (stars === 0) {
        toast.error("Please select a rating first.");
        return;
      }
      setRatingSubmitting(true);
      try {
        if (actor) {
          await actor.submitRating(SESSION_ID, BigInt(stars));
          const stats = await actor.getRatingStats();
          setAvgRating(Number(stats.averageRating) / 100);
          setNumRatings(Number(stats.numRatings));
        }
        toast.success("Thank you for your rating! ⭐");
        if (fromModal) {
          setShowRatingModal(false);
          setModalStars(0);
        } else {
          setSelectedStars(0);
        }
      } catch {
        toast.error("Could not submit rating. Please try again.");
      } finally {
        setRatingSubmitting(false);
      }
    },
    [actor],
  );

  // Subscribe
  const handleSubscribe = useCallback(async () => {
    setSubscribing(true);
    try {
      if (actor) await actor.recordSubscription(SESSION_ID, "2-month");
      toast.success(
        "Subscription recorded! You'll be notified when Stripe is connected. 🎮",
      );
    } catch {
      toast.error("Could not process subscription. Please try again.");
    } finally {
      setSubscribing(false);
    }
  }, [actor]);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "suggester", label: "AI Suggester" },
    { id: "upload", label: "Upload" },
    { id: "pricing", label: "Pricing" },
    { id: "ratings", label: "Ratings" },
  ];

  return (
    <div className="relative min-h-screen bg-gaming-dark font-body">
      {/* Ambient background blobs */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-0 w-[600px] h-[600px] blob-cyan opacity-60 blur-3xl" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] blob-purple opacity-50 blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-[400px] h-[400px] blob-cyan opacity-30 blur-3xl" />
      </div>

      <Toaster />

      {/* ===== NAVBAR ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/playsense-logo-transparent.dim_80x80.png"
              alt="PLAY SENSE AI logo"
              height={40}
              style={{
                height: "40px",
                width: "auto",
                filter: "drop-shadow(0 0 8px #00E5FF)",
              }}
              className="group-hover:scale-105 transition-transform"
            />
            <span className="font-orbitron text-xs font-bold tracking-widest text-foreground hidden sm:block">
              PLAY SENSE AI
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                data-ocid="nav.link"
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-md ${
                  activeSection === link.id
                    ? "neon-text-cyan border-b-2 border-[oklch(0.82_0.18_200)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo("suggester")}
              data-ocid="nav.primary_button"
              className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold neon-border-cyan neon-text-cyan hover:bg-[oklch(0.82_0.18_200_/_0.1)] transition-all duration-200"
            >
              <Zap className="w-3.5 h-3.5" />
              Get Started
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              data-ocid="nav.toggle"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden glass-panel border-t border-white/5 px-4 py-4 flex flex-col gap-2"
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className={`px-4 py-3 text-left text-sm font-medium rounded-lg transition-all ${
                    activeSection === link.id
                      ? "bg-[oklch(0.82_0.18_200_/_0.1)] neon-text-cyan"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-16">
        {/* ===== HOME ===== */}
        <section id="home" className="relative min-h-screen flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-[oklch(0.82_0.18_200)]" />
                <span className="text-xs font-semibold tracking-[0.3em] neon-text-cyan uppercase">
                  AI-Powered Gaming
                </span>
              </div>
              <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-foreground">
                YOUR <span className="neon-text-cyan">AI GAME</span> SPECIALIST
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Describe your mood, vibe, or preferences — our AI instantly
                curates personalized game recommendations from a library of 55+
                titles across every genre.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo("suggester")}
                  data-ocid="home.primary_button"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold bg-[oklch(0.82_0.18_200)] text-gaming-darker hover:shadow-neon-cyan hover:scale-105 transition-all duration-200"
                >
                  <Bot className="w-4 h-4" />
                  Explore Games
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("pricing")}
                  data-ocid="home.secondary_button"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold neon-border-cyan text-foreground hover:bg-[oklch(0.82_0.18_200_/_0.1)] transition-all duration-200"
                >
                  <CreditCard className="w-4 h-4" />
                  View Plans
                </button>
              </div>
              <div className="flex gap-8 pt-2">
                {[
                  { label: "Games", value: "55+" },
                  { label: "Genres", value: "8" },
                  { label: "AI Matches", value: "∞" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-orbitron text-2xl font-bold neon-text-cyan">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground tracking-wide uppercase mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — decorative chat card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="glass-panel neon-border-cyan rounded-2xl p-6 shadow-glass">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-[oklch(0.82_0.18_200_/_0.15)] flex items-center justify-center neon-border-cyan">
                    <Bot className="w-4 h-4 neon-text-cyan" />
                  </div>
                  <div>
                    <div className="font-orbitron text-xs font-bold neon-text-cyan">
                      AI GAME CHAT
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Describe your mood...
                    </div>
                  </div>
                  <div className="ml-auto flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-[oklch(0.82_0.18_200)] animate-pulse-neon" />
                    <span className="text-xs text-muted-foreground">
                      Online
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mb-5">
                  <div className="flex justify-end">
                    <div className="bg-[oklch(0.82_0.18_200_/_0.15)] border border-[oklch(0.82_0.18_200_/_0.25)] rounded-xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-sm text-foreground">
                        "I want something relaxing but still engaging"
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-[oklch(0.16_0.018_230)] border border-white/10 rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-xs neon-text-cyan font-semibold mb-1">
                        AI Recommends:
                      </p>
                      <p className="text-sm text-foreground">
                        🌾 <strong>Farm Frontier</strong> — Cozy farming sim
                        with relaxing gameplay and deep progression.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[oklch(0.82_0.18_200_/_0.15)] border border-[oklch(0.82_0.18_200_/_0.25)] rounded-xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-sm text-foreground">
                        "Show me scary horror games"
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-[oklch(0.16_0.018_230)] border border-white/10 rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-xs neon-text-cyan font-semibold mb-1">
                        AI Recommends:
                      </p>
                      <p className="text-sm text-foreground">
                        👻 <strong>Void Crawler</strong> — Space horror
                        masterpiece. Alien creatures hunt by sound.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[oklch(0.12_0.015_230)] border border-[oklch(0.82_0.18_200_/_0.25)] rounded-full px-4 py-2.5 text-sm text-muted-foreground">
                    Ask about any game...
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollTo("suggester")}
                    className="px-4 py-2.5 rounded-full text-xs font-bold neon-border-cyan neon-text-cyan hover:bg-[oklch(0.82_0.18_200_/_0.15)] transition-all"
                  >
                    ASK AI
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-[oklch(0.82_0.18_200_/_0.15)] blur-xl rounded-full" />
            </motion.div>
          </div>

          {/* Feature highlights */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: "AI SUGGESTIONS",
                  desc: "Keyword-smart AI matches your preferences to the perfect games from 55+ titles across 8 genres.",
                  border: "neon-border-cyan",
                },
                {
                  icon: <ImageIcon className="w-6 h-6" />,
                  title: "IMAGE UPLOAD",
                  desc: "Upload up to 5 game screenshots or artwork daily. Track your uploads and showcase your favorites.",
                  border: "neon-border-purple",
                },
                {
                  icon: <Trophy className="w-6 h-6" />,
                  title: "COMMUNITY RATINGS",
                  desc: "Rate and discover top-rated games. Your feedback shapes the gaming community.",
                  border: "neon-border-cyan",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                  className={`glass-panel ${feature.border} rounded-xl p-6 flex gap-4 items-start`}
                >
                  <div className="mt-1 neon-text-cyan">{feature.icon}</div>
                  <div>
                    <h3 className="font-orbitron text-sm font-bold text-foreground tracking-wider mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollTo("suggester")}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors animate-float"
            aria-label="Scroll to AI Suggester"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </section>

        {/* ===== FEATURED RECOMMENDATIONS ===== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-foreground tracking-wider uppercase mb-3">
              AI Game <span className="neon-text-cyan">Recommendations</span>
            </h2>
            <p className="text-muted-foreground">
              Top picks curated by our AI engine
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_GAMES.map(({ game, img }, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`glass-panel rounded-2xl overflow-hidden border ${
                  idx % 2 === 0
                    ? "border-[oklch(0.82_0.18_200_/_0.25)]"
                    : "border-[oklch(0.65_0.22_290_/_0.25)]"
                } hover:scale-[1.02] transition-transform duration-300 shadow-glass flex flex-col`}
                data-ocid={`featured.item.${idx + 1}`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={img}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gaming-card via-transparent to-transparent" />
                  <Badge
                    className={`absolute top-3 left-3 text-xs border ${
                      GENRE_COLORS[game.genre]
                    } bg-gaming-darker/80 backdrop-blur-sm`}
                  >
                    {game.genre}
                  </Badge>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-orbitron text-sm font-bold text-foreground tracking-wide uppercase mb-2">
                    {game.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-3">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <StarRating
                      value={Math.round(game.rating)}
                      readonly
                      size="sm"
                    />
                    <span className="text-xs neon-text-cyan font-semibold">
                      {game.rating.toFixed(1)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollTo("suggester")}
                    className={`mt-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all ${
                      idx % 2 === 0
                        ? "neon-border-cyan neon-text-cyan hover:bg-[oklch(0.82_0.18_200_/_0.1)]"
                        : "neon-border-purple text-[oklch(0.65_0.22_290)] hover:bg-[oklch(0.65_0.22_290_/_0.1)]"
                    }`}
                    data-ocid={`featured.edit_button.${idx + 1}`}
                  >
                    Find Similar Games
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== AI SUGGESTER ===== */}
        <section
          id="suggester"
          className="py-20 max-w-7xl mx-auto px-4 sm:px-6"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Bot className="w-6 h-6 neon-text-cyan" />
              <span className="font-orbitron text-xs font-bold tracking-[0.3em] uppercase neon-text-cyan">
                AI Engine
              </span>
            </div>
            <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-foreground tracking-wider uppercase mb-3">
              AI Game <span className="neon-text-cyan">Suggester</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tell us what you're in the mood for — action, horror, chill, funny
              — and our AI will find your perfect match.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="glass-panel neon-border-cyan rounded-2xl p-6 shadow-glass">
              <Textarea
                value={suggestionInput}
                onChange={(e) => setSuggestionInput(e.target.value)}
                placeholder="Describe your mood, preferences, or the type of game you're looking for... e.g. 'I like fast-paced action games' or 'something relaxing to unwind'"
                className="min-h-[120px] bg-[oklch(0.12_0.015_230)] border-[oklch(0.30_0.04_210)] text-foreground placeholder:text-muted-foreground/50 focus:border-[oklch(0.82_0.18_200)] focus:ring-[oklch(0.82_0.18_200_/_0.3)] rounded-xl resize-none text-sm"
                data-ocid="suggester.textarea"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                    handleGetSuggestions();
                }}
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted-foreground">
                  Requests:{" "}
                  <span className="neon-text-cyan font-semibold">
                    {suggestionCount}
                  </span>
                </span>
                <Button
                  onClick={handleGetSuggestions}
                  disabled={isLoadingSuggestions || !suggestionInput.trim()}
                  data-ocid="suggester.submit_button"
                  className="px-8 py-2.5 rounded-full font-semibold tracking-wider uppercase text-xs bg-transparent neon-border-cyan neon-text-cyan hover:bg-[oklch(0.82_0.18_200_/_0.15)] hover:shadow-neon-cyan-sm transition-all duration-200 disabled:opacity-50"
                >
                  {isLoadingSuggestions ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" />
                      Get Suggestions
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {suggestions.length > 0 && (
                <motion.div
                  key={suggestionCount}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 flex flex-col gap-5"
                  data-ocid="suggester.list"
                >
                  <h3 className="font-orbitron text-sm font-bold tracking-widest uppercase text-muted-foreground">
                    Top Matches —{" "}
                    <span className="neon-text-cyan">
                      {suggestions.length} games found
                    </span>
                  </h3>
                  {suggestions.map((match, idx) => (
                    <motion.div
                      key={match.game.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="glass-panel rounded-xl p-5 border border-[oklch(0.82_0.18_200_/_0.15)] hover:border-[oklch(0.82_0.18_200_/_0.35)] transition-all duration-200"
                      data-ocid={`suggester.item.${idx + 1}`}
                    >
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <h4 className="font-orbitron text-sm font-bold text-foreground tracking-wide uppercase flex-1">
                          {match.game.name}
                        </h4>
                        <Badge
                          className={`text-xs border ${GENRE_COLORS[match.game.genre]} bg-gaming-darker/80 shrink-0`}
                        >
                          {match.game.genre}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {match.game.description}
                      </p>
                      <div className="flex items-center gap-3 mb-3">
                        <StarRating
                          value={Math.round(match.game.rating)}
                          readonly
                          size="sm"
                        />
                        <span className="text-xs text-muted-foreground">
                          {match.game.rating.toFixed(1)}/5.0
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({match.game.releaseYear})
                        </span>
                      </div>
                      <div className="bg-[oklch(0.82_0.18_200_/_0.06)] border border-[oklch(0.82_0.18_200_/_0.2)] rounded-lg px-3 py-2">
                        <span className="text-xs font-semibold neon-text-cyan mr-2">
                          Why this matches:
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {match.whyMatches}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {suggestions.length === 0 &&
              suggestionCount > 0 &&
              !isLoadingSuggestions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-center text-muted-foreground py-10"
                  data-ocid="suggester.empty_state"
                >
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    No matches found. Try different keywords!
                  </p>
                  <p className="text-xs mt-1 opacity-60">
                    Hint: try "action", "horror", "racing", "chill", "funny"
                  </p>
                </motion.div>
              )}
          </div>
        </section>

        {/* ===== UPLOAD ===== */}
        <section id="upload" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <ImageIcon className="w-6 h-6 neon-text-cyan" />
              <span className="font-orbitron text-xs font-bold tracking-[0.3em] uppercase neon-text-cyan">
                File Hub
              </span>
            </div>
            <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-foreground tracking-wider uppercase mb-3">
              Optimize Your <span className="neon-text-cyan">Files</span>
            </h2>
            <p className="text-muted-foreground">
              Upload game screenshots, artwork, or images — up to 5 per day.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-orbitron text-sm font-bold tracking-wide">
                <span className="neon-text-cyan">{uploadCount}</span>
                <span className="text-muted-foreground">
                  /5 uploads used today
                </span>
              </span>
              {uploadCount >= 5 && (
                <span
                  className="text-xs text-red-400 font-medium"
                  data-ocid="upload.error_state"
                >
                  Daily limit reached
                </span>
              )}
            </div>

            <div className="h-1.5 bg-muted/30 rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[oklch(0.82_0.18_200)] to-[oklch(0.65_0.22_290)]"
                initial={{ width: 0 }}
                animate={{ width: `${(uploadCount / 5) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => uploadCount < 5 && fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (uploadCount < 5) fileInputRef.current?.click();
                }
              }}
              tabIndex={uploadCount >= 5 ? -1 : 0}
              data-ocid="upload.dropzone"
              className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
                uploadCount >= 5
                  ? "border-muted/30 opacity-50 cursor-not-allowed"
                  : isDragging
                    ? "border-[oklch(0.82_0.18_200)] bg-[oklch(0.82_0.18_200_/_0.08)] cursor-copy shadow-neon-cyan"
                    : "border-[oklch(0.82_0.18_200_/_0.3)] hover:border-[oklch(0.82_0.18_200_/_0.6)] hover:bg-[oklch(0.82_0.18_200_/_0.04)] cursor-pointer"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
                aria-label="Upload images"
              />
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isDragging
                      ? "neon-glow-cyan bg-[oklch(0.82_0.18_200_/_0.15)]"
                      : "bg-[oklch(0.16_0.018_230)] border border-[oklch(0.82_0.18_200_/_0.2)]"
                  }`}
                >
                  <Upload className="w-7 h-7 neon-text-cyan" />
                </div>
                {uploadCount >= 5 ? (
                  <div>
                    <p className="font-semibold text-muted-foreground">
                      Daily limit reached
                    </p>
                    <p className="text-sm text-muted-foreground/60 mt-1">
                      Come back tomorrow!
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-foreground">
                      {isDragging
                        ? "Drop your images here"
                        : "Drag & drop images here"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse your files
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      PNG, JPG, GIF, WebP up to 10MB each
                    </p>
                  </div>
                )}
                {uploadCount < 5 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    data-ocid="upload.upload_button"
                    className="px-6 py-2 rounded-full text-sm font-semibold neon-border-cyan neon-text-cyan hover:bg-[oklch(0.82_0.18_200_/_0.15)] transition-all"
                  >
                    Upload Files
                  </button>
                )}
              </div>
            </div>

            {uploadedImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3"
                data-ocid="upload.list"
              >
                {uploadedImages.map((url, idx) => (
                  <div
                    key={url}
                    className="relative group rounded-xl overflow-hidden aspect-square"
                    data-ocid={`upload.item.${idx + 1}`}
                  >
                    <img
                      src={url}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gaming-darker/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Check className="w-5 h-5 text-[oklch(0.82_0.18_200)]" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* ===== PRICING + RATINGS ===== */}
        <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-foreground tracking-wider uppercase mb-3">
              Plans & <span className="neon-text-cyan">Community</span>
            </h2>
            <p className="text-muted-foreground">
              Level up with a subscription or share your experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pricing card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-panel rounded-2xl overflow-hidden neon-border-cyan shadow-glass"
              data-ocid="pricing.card"
            >
              <div className="p-8">
                <div className="inline-flex items-center gap-2 bg-[oklch(0.82_0.18_200_/_0.1)] border border-[oklch(0.82_0.18_200_/_0.3)] rounded-full px-4 py-1.5 mb-6">
                  <Rocket className="w-3.5 h-3.5 neon-text-cyan" />
                  <span className="font-orbitron text-xs font-bold neon-text-cyan tracking-widest">
                    2-MONTH PACKAGE
                  </span>
                </div>
                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="font-orbitron text-6xl font-black neon-text-cyan leading-none">
                      $1
                    </span>
                    <span className="font-orbitron text-2xl font-bold text-muted-foreground mb-1">
                      .00
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    ₹92 (Indian Rupees) · Billed once
                  </p>
                </div>
                <ul className="flex flex-col gap-3 mb-8">
                  {[
                    "Unlimited Game Suggestions",
                    "5 Daily Image Uploads",
                    "Priority Support",
                    "Early Access to New Features",
                    "Exclusive Game Deals & Alerts",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <div className="w-5 h-5 rounded-full bg-[oklch(0.82_0.18_200_/_0.15)] border border-[oklch(0.82_0.18_200_/_0.4)] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 neon-text-cyan" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  data-ocid="pricing.submit_button"
                  className="w-full py-3.5 rounded-full font-orbitron text-sm font-bold tracking-widest uppercase neon-border-cyan neon-text-cyan hover:bg-[oklch(0.82_0.18_200_/_0.15)] hover:shadow-neon-cyan transition-all duration-200 disabled:opacity-60"
                >
                  {subscribing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Subscribe Now
                    </span>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Shield className="w-3.5 h-3.5 text-muted-foreground/60" />
                  <p className="text-xs text-muted-foreground/60 text-center">
                    Payment processing will be enabled once Stripe is connected
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Ratings card */}
            <motion.div
              id="ratings"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-panel rounded-2xl overflow-hidden neon-border-purple shadow-glass"
              data-ocid="ratings.card"
            >
              <div className="p-8">
                <div className="inline-flex items-center gap-2 bg-[oklch(0.65_0.22_290_/_0.1)] border border-[oklch(0.65_0.22_290_/_0.3)] rounded-full px-4 py-1.5 mb-6">
                  <Star className="w-3.5 h-3.5 text-[oklch(0.65_0.22_290)]" />
                  <span className="font-orbitron text-xs font-bold text-[oklch(0.65_0.22_290)] tracking-widest">
                    COMMUNITY REVIEW
                  </span>
                </div>
                <div className="flex items-end gap-4 mb-8">
                  <div>
                    <div className="font-orbitron text-6xl font-black neon-text-cyan leading-none">
                      {numRatings > 0 ? avgRating.toFixed(1) : "—"}
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      out of 5.0
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 pb-1">
                    <StarRating
                      value={numRatings > 0 ? Math.round(avgRating) : 0}
                      readonly
                      size="md"
                    />
                    <span className="text-xs text-muted-foreground">
                      {numRatings > 0
                        ? `${numRatings} rating${numRatings !== 1 ? "s" : ""}`
                        : "No ratings yet"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-6">
                  <p className="font-orbitron text-sm font-bold tracking-widest uppercase text-foreground mb-4">
                    Rate This Website
                  </p>
                  <p className="text-sm text-muted-foreground mb-5">
                    How was your experience? Your feedback helps us improve!
                  </p>
                  <div className="mb-6">
                    <StarRating
                      value={selectedStars}
                      onChange={setSelectedStars}
                      size="lg"
                    />
                    {selectedStars > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs neon-text-cyan mt-2"
                      >
                        You selected: {selectedStars} star
                        {selectedStars !== 1 ? "s" : ""}
                      </motion.p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => submitRating(selectedStars, false)}
                    disabled={ratingSubmitting || selectedStars === 0}
                    data-ocid="ratings.submit_button"
                    className="w-full py-3 rounded-full font-orbitron text-sm font-bold tracking-widest uppercase border border-[oklch(0.65_0.22_290_/_0.5)] text-[oklch(0.65_0.22_290)] hover:bg-[oklch(0.65_0.22_290_/_0.15)] hover:shadow-neon-purple-sm transition-all duration-200 disabled:opacity-50"
                  >
                    {ratingSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      "Submit Rating"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-white/5 glass-panel py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src="/assets/generated/playsense-logo-transparent.dim_80x80.png"
                    alt="PLAY SENSE AI logo"
                    style={{
                      height: "32px",
                      width: "auto",
                      filter: "drop-shadow(0 0 8px #00E5FF)",
                    }}
                  />
                  <span className="font-orbitron text-xs font-bold tracking-widest text-foreground">
                    PLAY SENSE AI
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AI-powered game discovery. Find your perfect game based on
                  your mood and preferences.
                </p>
              </div>
              <div>
                <h4 className="font-orbitron text-xs font-bold tracking-widest uppercase text-foreground mb-4">
                  Quick Links
                </h4>
                <ul className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <button
                        type="button"
                        onClick={() => scrollTo(link.id)}
                        className="text-sm text-muted-foreground hover:neon-text-cyan transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-orbitron text-xs font-bold tracking-widest uppercase text-foreground mb-4">
                  Features
                </h4>
                <ul className="flex flex-col gap-2">
                  {[
                    {
                      icon: <Bot className="w-3.5 h-3.5" />,
                      label: "AI Suggestions",
                    },
                    {
                      icon: <ImageIcon className="w-3.5 h-3.5" />,
                      label: "Image Upload",
                    },
                    {
                      icon: <CreditCard className="w-3.5 h-3.5" />,
                      label: "Subscription",
                    },
                    {
                      icon: <Star className="w-3.5 h-3.5" />,
                      label: "Ratings",
                    },
                  ].map(({ icon, label }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="neon-text-cyan">{icon}</span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground/60">
                &copy; {new Date().getFullYear()} PLAY SENSE AI. All rights
                reserved.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-text-cyan hover:underline"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* ===== RATING MODAL ===== */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent
          className="glass-panel border border-[oklch(0.82_0.18_200_/_0.35)] shadow-neon-cyan max-w-md"
          data-ocid="ratings.modal"
        >
          <DialogHeader>
            <DialogTitle className="font-orbitron text-lg font-bold tracking-wider uppercase neon-text-cyan text-center">
              Please Rate Our Website
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm mt-2">
              You've been using our AI suggester! How are we doing?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="p-4 rounded-xl bg-[oklch(0.82_0.18_200_/_0.06)] border border-[oklch(0.82_0.18_200_/_0.15)]">
              <StarRating
                value={modalStars}
                onChange={setModalStars}
                size="lg"
              />
            </div>
            {modalStars > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm neon-text-cyan font-medium"
              >
                {
                  ["Terrible", "Poor", "Average", "Good", "Excellent!"][
                    modalStars - 1
                  ]
                }
              </motion.p>
            )}
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => {
                  setShowRatingModal(false);
                  setModalStars(0);
                }}
                data-ocid="ratings.cancel_button"
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-muted-foreground border border-white/10 hover:bg-white/5 transition-all"
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={() => submitRating(modalStars, true)}
                disabled={ratingSubmitting || modalStars === 0}
                data-ocid="ratings.confirm_button"
                className="flex-1 py-2.5 rounded-full text-sm font-bold neon-border-cyan neon-text-cyan hover:bg-[oklch(0.82_0.18_200_/_0.15)] transition-all disabled:opacity-50"
              >
                {ratingSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Submitting
                  </span>
                ) : (
                  "Submit Rating"
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Suppress unused import warning for Gamepad2 (kept for potential future use)
void Gamepad2;
