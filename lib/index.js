// import bitcoin from 'bitcoinjs-lib'
// import TESTNET from 'bitcoin'
// import nostrTools from 'nostr-tools'
// const { getPublicKey } = nostrTools

import { ECPairFactory } from 'ecpair'
import * as secp256k1 from '@noble/secp256k1'
// import { bech32 } from '@scure/base'
import nacl from 'tweetnacl'
import { bech32, bech32m } from 'bech32'
import { readFileSync } from 'fs'
import { createHash, pbkdf2Sync } from 'crypto'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import * as bitcoin from 'bitcoinjs-lib'
import { BIP32Factory } from 'bip32'
import * as tinysecp256k1 from 'tiny-secp256k1'

// Initialize ECC library for bitcoinjs-lib and BIP32
bitcoin.initEccLib(tinysecp256k1)
const bip32 = BIP32Factory(tinysecp256k1)

// BIP39 wordlist embedded to avoid file system issues with npx
const BIP39_WORDLIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic",
  "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest",
  "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset",
  "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
  "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake",
  "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge",
  "bag", "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain",
  "barrel", "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become",
  "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit",
  "best", "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology",
  "bird", "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless",
  "blind", "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body",
  "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss",
  "bottom", "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread",
  "breeze", "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze",
  "broom", "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb",
  "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy",
  "butter", "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call",
  "calm", "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas",
  "canyon", "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry",
  "cart", "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category",
  "cattle", "caught", "cause", "caution", "cave", "ceiling", "celery", "cement", "census", "century",
  "cereal", "certain", "chair", "chalk", "champion", "change", "chaos", "chapter", "charge", "chase",
  "chat", "cheap", "check", "cheese", "chef", "cherry", "chest", "chicken", "chief", "child",
  "chimney", "choice", "choose", "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle",
  "citizen", "city", "civil", "claim", "clap", "clarify", "claw", "clay", "clean", "clerk",
  "clever", "click", "client", "cliff", "climb", "clinic", "clip", "clock", "clog", "close",
  "cloth", "cloud", "clown", "club", "clump", "cluster", "clutch", "coach", "coast", "coconut",
  "code", "coffee", "coil", "coin", "collect", "color", "column", "combine", "come", "comfort",
  "comic", "common", "company", "concert", "conduct", "confirm", "congress", "connect", "consider", "control",
  "convince", "cook", "cool", "copper", "copy", "coral", "core", "corn", "correct", "cost",
  "cotton", "couch", "country", "couple", "course", "cousin", "cover", "coyote", "crack", "cradle",
  "craft", "cram", "crane", "crash", "crater", "crawl", "crazy", "cream", "credit", "creek",
  "crew", "cricket", "crime", "crisp", "critic", "crop", "cross", "crouch", "crowd", "crucial",
  "cruel", "cruise", "crumble", "crunch", "crush", "cry", "crystal", "cube", "culture", "cup",
  "cupboard", "curious", "current", "curtain", "curve", "cushion", "custom", "cute", "cycle", "dad",
  "damage", "damp", "dance", "danger", "daring", "dash", "daughter", "dawn", "day", "deal",
  "debate", "debris", "decade", "december", "decide", "decline", "decorate", "decrease", "deer", "defense",
  "define", "defy", "degree", "delay", "deliver", "demand", "demise", "denial", "dentist", "deny",
  "depart", "depend", "deposit", "depth", "deputy", "derive", "describe", "desert", "design", "desk",
  "despair", "destroy", "detail", "detect", "develop", "device", "devote", "diagram", "dial", "diamond",
  "diary", "dice", "diesel", "diet", "differ", "digital", "dignity", "dilemma", "dinner", "dinosaur",
  "direct", "dirt", "disagree", "discover", "disease", "dish", "dismiss", "disorder", "display", "distance",
  "divert", "divide", "divorce", "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain",
  "donate", "donkey", "donor", "door", "dose", "double", "dove", "draft", "dragon", "drama",
  "drastic", "draw", "dream", "dress", "drift", "drill", "drink", "drip", "drive", "drop",
  "drum", "dry", "duck", "dumb", "dune", "during", "dust", "dutch", "duty", "dwarf",
  "dynamic", "eager", "eagle", "early", "earn", "earth", "easily", "east", "easy", "echo",
  "ecology", "economy", "edge", "edit", "educate", "effort", "egg", "eight", "either", "elbow",
  "elder", "electric", "elegant", "element", "elephant", "elevator", "elite", "else", "embark", "embody",
  "embrace", "emerge", "emotion", "employ", "empower", "empty", "enable", "enact", "end", "endless",
  "endorse", "enemy", "energy", "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough",
  "enrich", "enroll", "ensure", "enter", "entire", "entry", "envelope", "episode", "equal", "equip",
  "era", "erase", "erode", "erosion", "error", "erupt", "escape", "essay", "essence", "estate",
  "eternal", "ethics", "evidence", "evil", "evoke", "evolve", "exact", "example", "excess", "exchange",
  "excite", "exclude", "excuse", "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit",
  "exotic", "expand", "expect", "expire", "explain", "expose", "express", "extend", "extra", "eye",
  "eyebrow", "fabric", "face", "faculty", "fade", "faint", "faith", "fall", "false", "fame",
  "family", "famous", "fan", "fancy", "fantasy", "farm", "fashion", "fat", "fatal", "father",
  "fatigue", "fault", "favorite", "feature", "february", "federal", "fee", "feed", "feel", "female",
  "fence", "festival", "fetch", "fever", "few", "fiber", "fiction", "field", "figure", "file",
  "film", "filter", "final", "find", "fine", "finger", "finish", "fire", "firm", "first",
  "fiscal", "fish", "fit", "fitness", "fix", "flag", "flame", "flash", "flat", "flavor",
  "flee", "flight", "flip", "float", "flock", "floor", "flower", "fluid", "flush", "fly",
  "foam", "focus", "fog", "foil", "fold", "follow", "food", "foot", "force", "forest",
  "forget", "fork", "fortune", "forum", "forward", "fossil", "foster", "found", "fox", "fragile",
  "frame", "frequent", "fresh", "friend", "fringe", "frog", "front", "frost", "frown", "frozen",
  "fruit", "fuel", "fun", "funny", "furnace", "fury", "future", "gadget", "gain", "galaxy",
  "gallery", "game", "gap", "garage", "garbage", "garden", "garlic", "garment", "gas", "gasp",
  "gate", "gather", "gauge", "gaze", "general", "genius", "genre", "gentle", "genuine", "gesture",
  "ghost", "giant", "gift", "giggle", "ginger", "giraffe", "girl", "give", "glad", "glance",
  "glare", "glass", "glide", "glimpse", "globe", "gloom", "glory", "glove", "glow", "glue",
  "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip", "govern", "gown",
  "grab", "grace", "grain", "grant", "grape", "grass", "gravity", "great", "green", "grid",
  "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide", "guilt",
  "guitar", "gun", "gym", "habit", "hair", "half", "hammer", "hamster", "hand", "happy",
  "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard", "head", "health",
  "heart", "heavy", "hedgehog", "height", "hello", "helmet", "help", "hen", "hero", "hidden",
  "high", "hill", "hint", "hip", "hire", "history", "hobby", "hockey", "hold", "hole",
  "holiday", "hollow", "home", "honey", "hood", "hope", "horn", "horror", "horse", "hospital",
  "host", "hotel", "hour", "hover", "hub", "huge", "human", "humble", "humor", "hundred",
  "hungry", "hunt", "hurdle", "hurry", "hurt", "husband", "hybrid", "ice", "icon", "idea",
  "identify", "idle", "ignore", "ill", "illegal", "illness", "image", "imitate", "immense", "immune",
  "impact", "impose", "improve", "impulse", "inch", "include", "income", "increase", "index", "indicate",
  "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit", "initial", "inject", "injury",
  "inmate", "inner", "innocent", "input", "inquiry", "insane", "insect", "inside", "inspire", "install",
  "intact", "interest", "into", "invest", "invite", "involve", "iron", "island", "isolate", "issue",
  "item", "ivory", "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly", "jewel",
  "job", "join", "joke", "journey", "joy", "judge", "juice", "jump", "jungle", "junior",
  "junk", "just", "kangaroo", "keen", "keep", "ketchup", "key", "kick", "kid", "kidney",
  "kind", "kingdom", "kiss", "kit", "kitchen", "kite", "kitten", "kiwi", "knee", "knife",
  "knock", "know", "lab", "label", "labor", "ladder", "lady", "lake", "lamp", "language",
  "laptop", "large", "later", "latin", "laugh", "laundry", "lava", "law", "lawn", "lawsuit",
  "layer", "lazy", "leader", "leaf", "learn", "leave", "lecture", "left", "leg", "legal",
  "legend", "leisure", "lemon", "lend", "length", "lens", "leopard", "lesson", "letter", "level",
  "liar", "liberty", "library", "license", "life", "lift", "light", "like", "limb", "limit",
  "link", "lion", "liquid", "list", "little", "live", "lizard", "load", "loan", "lobster",
  "local", "lock", "logic", "lonely", "long", "loop", "lottery", "loud", "lounge", "love",
  "loyal", "lucky", "luggage", "lumber", "lunar", "lunch", "luxury", "lyrics", "machine", "mad",
  "magic", "magnet", "maid", "mail", "main", "major", "make", "mammal", "man", "manage",
  "mandate", "mango", "mansion", "manual", "maple", "marble", "march", "margin", "marine", "market",
  "marriage", "mask", "mass", "master", "match", "material", "math", "matrix", "matter", "maximum",
  "maze", "meadow", "mean", "measure", "meat", "mechanic", "medal", "media", "melody", "melt",
  "member", "memory", "mention", "menu", "mercy", "merge", "merit", "merry", "mesh", "message",
  "metal", "method", "middle", "midnight", "milk", "million", "mimic", "mind", "minimum", "minor",
  "minute", "miracle", "mirror", "misery", "miss", "mistake", "mix", "mixed", "mixture", "mobile",
  "model", "modify", "mom", "moment", "monitor", "monkey", "monster", "month", "moon", "moral",
  "more", "morning", "mosquito", "mother", "motion", "motor", "mountain", "mouse", "move", "movie",
  "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom", "music", "must", "mutual",
  "myself", "mystery", "myth", "naive", "name", "napkin", "narrow", "nasty", "nation", "nature",
  "near", "neck", "need", "negative", "neglect", "neither", "nephew", "nerve", "nest", "net",
  "network", "neutral", "never", "news", "next", "nice", "night", "noble", "noise", "nominee",
  "noodle", "normal", "north", "nose", "notable", "note", "nothing", "notice", "novel", "now",
  "nuclear", "number", "nurse", "nut", "oak", "obey", "object", "oblige", "obscure", "observe",
  "obtain", "obvious", "occur", "ocean", "october", "odor", "off", "offer", "office", "often",
  "oil", "okay", "old", "olive", "olympic", "omit", "once", "one", "onion", "online",
  "only", "open", "opera", "opinion", "oppose", "option", "orange", "orbit", "orchard", "order",
  "ordinary", "organ", "orient", "original", "orphan", "ostrich", "other", "outdoor", "outer", "output",
  "outside", "oval", "oven", "over", "own", "owner", "oxygen", "oyster", "ozone", "pact",
  "paddle", "page", "pair", "palace", "palm", "panda", "panel", "panic", "panther", "paper",
  "parade", "parent", "park", "parrot", "party", "pass", "patch", "path", "patient", "patrol",
  "pattern", "pause", "pave", "payment", "peace", "peanut", "pear", "peasant", "pelican", "pen",
  "penalty", "pencil", "people", "pepper", "perfect", "permit", "person", "pet", "phone", "photo",
  "phrase", "physical", "piano", "picnic", "picture", "piece", "pig", "pigeon", "pill", "pilot",
  "pink", "pioneer", "pipe", "pistol", "pitch", "pizza", "place", "planet", "plastic", "plate",
  "play", "please", "pledge", "pluck", "plug", "plunge", "poem", "poet", "point", "polar",
  "pole", "police", "pond", "pony", "pool", "popular", "portion", "position", "possible", "post",
  "potato", "pottery", "poverty", "powder", "power", "practice", "praise", "predict", "prefer", "prepare",
  "present", "pretty", "prevent", "price", "pride", "primary", "print", "priority", "prison", "private",
  "prize", "problem", "process", "produce", "profit", "program", "project", "promote", "proof", "property",
  "prosper", "protect", "proud", "provide", "public", "pudding", "pull", "pulp", "pulse", "pumpkin",
  "punch", "pupil", "puppy", "purchase", "purity", "purpose", "purse", "push", "put", "puzzle",
  "pyramid", "quality", "quantum", "quarter", "question", "quick", "quit", "quiz", "quote", "rabbit",
  "raccoon", "race", "rack", "radar", "radio", "rail", "rain", "raise", "rally", "ramp",
  "ranch", "random", "range", "rapid", "rare", "rate", "rather", "raven", "raw", "razor",
  "ready", "real", "reason", "rebel", "rebuild", "recall", "receive", "recipe", "record", "recycle",
  "reduce", "reflect", "reform", "refuse", "region", "regret", "regular", "reject", "relax", "release",
  "relief", "rely", "remain", "remember", "remind", "remove", "render", "renew", "rent", "reopen",
  "repair", "repeat", "replace", "report", "require", "rescue", "resemble", "resist", "resource", "response",
  "result", "retire", "retreat", "return", "reunion", "reveal", "review", "reward", "rhythm", "rib",
  "ribbon", "rice", "rich", "ride", "ridge", "rifle", "right", "rigid", "ring", "riot",
  "ripple", "risk", "ritual", "rival", "river", "road", "roast", "robot", "robust", "rocket",
  "romance", "roof", "rookie", "room", "rose", "rotate", "rough", "round", "route", "royal",
  "rubber", "rude", "rug", "rule", "run", "runway", "rural", "sad", "saddle", "sadness",
  "safe", "sail", "salad", "salmon", "salon", "salt", "salute", "same", "sample", "sand",
  "satisfy", "satoshi", "sauce", "sausage", "save", "say", "scale", "scan", "scare", "scatter",
  "scene", "scheme", "school", "science", "scissors", "scorpion", "scout", "scrap", "screen", "script",
  "scrub", "sea", "search", "season", "seat", "second", "secret", "section", "security", "seed",
  "seek", "segment", "select", "sell", "seminar", "senior", "sense", "sentence", "series", "service",
  "session", "settle", "setup", "seven", "shadow", "shaft", "shallow", "share", "shed", "shell",
  "sheriff", "shield", "shift", "shine", "ship", "shiver", "shock", "shoe", "shoot", "shop",
  "short", "shoulder", "shove", "shrimp", "shrug", "shuffle", "shy", "sibling", "sick", "side",
  "siege", "sight", "sign", "silent", "silk", "silly", "silver", "similar", "simple", "since",
  "sing", "siren", "sister", "situate", "six", "size", "skate", "sketch", "ski", "skill",
  "skin", "skirt", "skull", "slab", "slam", "sleep", "slender", "slice", "slide", "slight",
  "slim", "slogan", "slot", "slow", "slush", "small", "smart", "smile", "smoke", "smooth",
  "snack", "snake", "snap", "sniff", "snow", "soap", "soccer", "social", "sock", "soda",
  "soft", "solar", "soldier", "solid", "solution", "solve", "someone", "song", "soon", "sorry",
  "sort", "soul", "sound", "soup", "source", "south", "space", "spare", "spatial", "spawn",
  "speak", "special", "speed", "spell", "spend", "sphere", "spice", "spider", "spike", "spin",
  "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot", "spray", "spread", "spring",
  "spy", "square", "squeeze", "squirrel", "stable", "stadium", "staff", "stage", "stairs", "stamp",
  "stand", "start", "state", "stay", "steak", "steel", "stem", "step", "stereo", "stick",
  "still", "sting", "stock", "stomach", "stone", "stool", "story", "stove", "strategy", "street",
  "strike", "strong", "struggle", "student", "stuff", "stumble", "style", "subject", "submit", "subway",
  "success", "such", "sudden", "suffer", "sugar", "suggest", "suit", "summer", "sun", "sunny",
  "sunset", "super", "supply", "supreme", "sure", "surface", "surge", "surprise", "surround", "survey",
  "suspect", "sustain", "swallow", "swamp", "swap", "swarm", "swear", "sweet", "swift", "swim",
  "swing", "switch", "sword", "symbol", "symptom", "syrup", "system", "table", "tackle", "tag",
  "tail", "talent", "talk", "tank", "tape", "target", "task", "taste", "tattoo", "taxi",
  "teach", "team", "tell", "ten", "tenant", "tennis", "tent", "term", "test", "text",
  "thank", "that", "theme", "then", "theory", "there", "they", "thing", "this", "thought",
  "three", "thrive", "throw", "thumb", "thunder", "ticket", "tide", "tiger", "tilt", "timber",
  "time", "tiny", "tip", "tired", "tissue", "title", "toast", "tobacco", "today", "toddler",
  "toe", "together", "toilet", "token", "tomato", "tomorrow", "tone", "tongue", "tonight", "tool",
  "tooth", "top", "topic", "topple", "torch", "tornado", "tortoise", "toss", "total", "tourist",
  "toward", "tower", "town", "toy", "track", "trade", "traffic", "tragic", "train", "transfer",
  "trap", "trash", "travel", "tray", "treat", "tree", "trend", "trial", "tribe", "trick",
  "trigger", "trim", "trip", "trophy", "trouble", "truck", "true", "truly", "trumpet", "trust",
  "truth", "try", "tube", "tuition", "tumble", "tuna", "tunnel", "turkey", "turn", "turtle",
  "twelve", "twenty", "twice", "twin", "twist", "two", "type", "typical", "ugly", "umbrella",
  "unable", "unaware", "uncle", "uncover", "under", "undo", "unfair", "unfold", "unhappy", "uniform",
  "unique", "unit", "universe", "unknown", "unlock", "until", "unusual", "unveil", "update", "upgrade",
  "uphold", "upon", "upper", "upset", "urban", "urge", "usage", "use", "used", "useful",
  "useless", "usual", "utility", "vacant", "vacuum", "vague", "valid", "valley", "valve", "van",
  "vanish", "vapor", "various", "vast", "vault", "vehicle", "velvet", "vendor", "venture", "venue",
  "verb", "verify", "version", "very", "vessel", "veteran", "viable", "vibrant", "vicious", "victory",
  "video", "view", "village", "vintage", "violin", "virtual", "virus", "visa", "visit", "visual",
  "vital", "vivid", "vocal", "voice", "void", "volcano", "volume", "vote", "voyage", "wage",
  "wagon", "wait", "walk", "wall", "walnut", "want", "warfare", "warm", "warrior", "wash",
  "wasp", "waste", "water", "wave", "way", "wealth", "weapon", "wear", "weasel", "weather",
  "web", "wedding", "weekend", "weird", "welcome", "west", "wet", "whale", "what", "wheat",
  "wheel", "when", "where", "whip", "whisper", "wide", "width", "wife", "wild", "will",
  "win", "window", "wine", "wing", "wink", "winner", "winter", "wire", "wisdom", "wise",
  "wish", "witness", "wolf", "woman", "wonder", "wood", "wool", "word", "work", "world",
  "worry", "worth", "wrap", "wreck", "wrestle", "wrist", "write", "wrong", "yard", "year",
  "yellow", "you", "young", "youth", "zebra", "zero", "zone", "zoo"
]
// import * as tiny from 'tiny-secp256k1'

function z32Encode(hexData) {
  const alphabet = 'ybndrfg8ejkmcpqxot1uwisza345h769'
  const data = hexToBytes(hexData)
  let buffer = 0
  let bitsLeft = 0
  let output = ''

  for (const byte of data) {
    buffer = (buffer << 8) | byte
    bitsLeft += 8

    while (bitsLeft >= 5) {
      bitsLeft -= 5
      output += alphabet[(buffer >> bitsLeft) & 0x1f]
    }
  }

  if (bitsLeft > 0) {
    output += alphabet[(buffer << (5 - bitsLeft)) & 0x1f]
  }

  return output
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

/**
 * getPublicKey
 *
 * Gets a public key from a given private key
 *
 * @param {Buffer|Uint8Array} privateKey - The private key to use to generate the public key
 * @returns {String} Hex encoded public key
 */
function getPublicKey(privateKey) {
  return secp256k1.utils.bytesToHex(secp256k1.schnorr.getPublicKey(privateKey))
}

/**
 * Function to convert a hexadecimal data to a bech32 encoded string
 * @param {string} data - Hexadecimal data to be encoded
 * @param {string} prefix - Prefix of the bech32 encoded string
 * @returns {string} bech32 encoded string
 */
function nip19(data, prefix) {
  // console.log(data)
  const words = bech32.toWords(Buffer.from(data, 'hex'))
  return bech32.encode(prefix, words)
}

const TESTNET = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tb',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef
}

// FUNCTIONS
/**
 * Encode bytes into bech32 format
 * @param {string} prefix
 * @param {string} hex
 * @returns {string} bech32 encoded string
 */
function encodeBytes(prefix, hex) {
  const data = secp256k1.utils.hexToBytes(hex)
  let words = bech32m.toWords(data)
  words = [1, ...words]
  return bech32m.encode(prefix, words, 1500)
}

/**
 * Decode bech32 encoded bytes
 * @param {string} bech32EncodedString
 * @returns {string} hex
 * @throws {Error} if input is not a valid bech32 encoded string
 */
function decodeBytes(bech32EncodedString) {
  const { words } = bech32.decode(bech32EncodedString)
  const data = bech32.fromWords(words)
  const hex = data.map(byte => byte.toString(16).padStart(2, '0')).join('')

  return hex
}

// Convert a hex string to a buffer
// This function is used to convert a hex string to a buffer
// which is required by the bitcoinjs-lib library
// hex - the hex string to convert
// returns the buffer
const hexToBuffer = hex => Buffer.from(hex, 'hex')

/**
 * Generate BIP39 mnemonic from private key entropy
 * @param {string} privateKey - Private key in hex (16 or 32 bytes)
 * @returns {string} BIP39 mnemonic phrase (12 or 24 words)
 */
function generateBIP39Mnemonic(privateKey) {
  try {
    const words = BIP39_WORDLIST
    
    // Convert private key to bytes
    const entropy = Buffer.from(privateKey, 'hex')
    
    // Determine entropy length and checksum length
    const entropyBits = entropy.length * 8
    let checksumBits
    let wordCount
    
    if (entropyBits === 128) {
      checksumBits = 4  // 128-bit entropy needs 4-bit checksum = 12 words
      wordCount = 12
    } else if (entropyBits === 256) {
      checksumBits = 8  // 256-bit entropy needs 8-bit checksum = 24 words
      wordCount = 24
    } else {
      throw new Error(`Unsupported entropy length: ${entropyBits} bits`)
    }
    
    // Calculate SHA256 hash for checksum
    const hash = createHash('sha256').update(entropy).digest()
    
    // Create a bit string from entropy + checksum
    let bits = ''
    
    // Add entropy bits
    for (let i = 0; i < entropy.length; i++) {
      bits += entropy[i].toString(2).padStart(8, '0')
    }
    
    // Add checksum bits (take the first checksumBits from the hash)
    const checksumValue = hash[0] >> (8 - checksumBits)  // Get the first checksumBits
    bits += checksumValue.toString(2).padStart(checksumBits, '0')
    
    // Split into 11-bit groups
    const mnemonic = []
    for (let i = 0; i < wordCount; i++) {
      const startBit = i * 11
      const endBit = startBit + 11
      const wordBits = bits.slice(startBit, endBit)
      const wordIndex = parseInt(wordBits, 2)
      
      if (isNaN(wordIndex) || wordIndex >= words.length) {
        throw new Error(`Invalid word index: ${wordIndex} from bits: ${wordBits}`)
      }
      
      mnemonic.push(words[wordIndex])
    }
    
    return mnemonic.join(' ')
  } catch (error) {
    return `Error: ${error.message}`
  }
}

/**
 * Convert BIP39 mnemonic to seed
 * @param {string} mnemonic - BIP39 mnemonic phrase
 * @param {string} passphrase - Optional passphrase (empty string if none)
 * @returns {Buffer} 512-bit seed
 */
function mnemonicToSeed(mnemonic, passphrase = '') {
  const salt = 'mnemonic' + passphrase
  return pbkdf2Sync(mnemonic, salt, 2048, 64, 'sha512')
}

/**
 * Generate BIP86 (Taproot) extended keys and address
 * @param {string} mnemonic - BIP39 mnemonic phrase
 * @returns {Object} Object containing tprv, tpub, and P2TR address
 */
function generateBIP86Keys(mnemonic) {
  try {
    // Convert mnemonic to seed
    const seed = mnemonicToSeed(mnemonic)
    
    // Generate master key from seed (use pre-initialized bip32)
    const root = bip32.fromSeed(seed, bitcoin.networks.testnet)
    
    // Derive BIP86 path: m/86'/827167'/0' (RGB, account 0)
    const account = root.derivePath("m/86'/827167'/0'")
    
    // Get extended keys
    const tprv = account.toBase58()  // Private extended key
    const tpub = account.neutered().toBase58()  // Public extended key
    
    // Generate P2TR address using testnet path (m/86'/1'/0'/0/0)
    const testnetAccount = root.derivePath("m/86'/1'/0'")
    const child = testnetAccount.derive(0).derive(0)  // 0/0 = first receiving address
    
    // Create P2TR payment
    const p2tr = bitcoin.payments.p2tr({
      internalPubkey: child.publicKey.slice(1, 33), // Remove first byte (0x02/0x03)
      network: bitcoin.networks.testnet
    })
    
    return {
      tprv,
      tpub,
      p2tr_address: p2tr.address
    }
  } catch (error) {
    return {
      tprv: `Error: ${error.message}`,
      tpub: `Error: ${error.message}`,
      p2tr_address: `Error: ${error.message}`
    }
  }
}

/**
 * Generates a public key from a given private key using Ed25519
 *
 * @param {string} privKey - The private key to use to generate the public key
 *
 * @returns {string} The generated public key in hexadecimal format
 */
function generate_public_key(privKey) {
  const keyPair = nacl.sign.keyPair.fromSeed(hexToBuffer(privKey))
  return Buffer.from(keyPair.publicKey).toString('hex')
}

/**
 * Converts a given buffer to a hexadecimal string.
 * @param {Buffer} buffer - The buffer to convert.
 * @returns {string} The hexadecimal string.
 */
function bufferToHex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2))
    .join('')
}

/**
 * Converts a hexadecimal string to a base64 encoded string
 * @param {string} str A string of hexadecimal characters
 * @returns {string} A base64 encoded string
 */
function hexToBase64(str) {
  return Buffer.from(str, 'hex').toString('base64')
}

/**
 * This function adds two secp256k1 keys together using the XOR operator.
 *
 * @param {string} keyA - The first secp256k1 key to be added.
 * @param {string} keyB - The second secp256k1 key to be added.
 *
 * @returns {string} The result of the addition of the two keys in hexadecimal format.
 */
function secp256k1Add(keyA, keyB) {
  // xor is a binary operator that returns a 1 in each bit position for which the corresponding bits of its operands are different
  const xorKeyA = BigInt('0x' + keyA.slice(0, 64))
  const xorKeyB = BigInt('0x' + keyB.slice(0, 64))

  // xor the two keys
  const xorAdd = xorKeyA + xorKeyB

  // convert the result to hex
  const hexAdd = xorAdd.toString(16).padStart(64, '0')
  const result = `${hexAdd.slice(64)}`

  return result
}

class Base64 {
  static encode(bin) {
    const ss = []
    bin.map(b => ss.push(String.fromCharCode(b)))
    return btoa(ss.join(''))
  }

  static decode(text) {
    const s = atob(text)
    const res = new Uint8Array(s.length)
    for (let i = 0; i < s.length; i++) {
      res[i] = s.charCodeAt(i)
    }
    return res
  }
}

const bin2s = (bin, n, len) => {
  const b = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    b[i] = bin[i + n]
  }
  return new TextDecoder().decode(b)
}
const bin2i = (bin, n) => {
  return ((bin[n] & 0xff) << 24) | ((bin[n + 1] & 0xff) << 16) | ((bin[n + 2] & 0xff) << 8) | (bin[n + 3] & 0xff)
}
const subbin = (bin, n, len) => {
  const b = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    b[i] = bin[i + n]
  }
  return b
}
const setbin = (bin, off, b) => {
  for (let i = 0; i < b.length; i++) {
    bin[i + off] = b[i]
  }
  return bin
}
const i2bin = (b, off, n) => {
  b[off] = (n >> 24) & 0xff
  b[off + 1] = (n >> 16) & 0xff
  b[off + 2] = (n >> 8) & 0xff
  b[off + 3] = n & 0xff
}
const s2bin = (bin, off, s) => {
  setbin(bin, off, new TextEncoder().encode(s))
}
const bincat = (bin1, bin2) => {
  const bin = new Uint8Array(bin1.length + bin2.length)
  for (let i = 0; i < bin1.length; i++) {
    bin[i] = bin1[i]
  }
  for (let i = 0; i < bin2.length; i++) {
    bin[i + bin1.length] = bin2[i]
  }
  return bin
}
const eqbin = (bin1, bin2) => {
  if (bin1 == bin2) {
    return true
  }
  if (!bin1 || !bin2) {
    return false
  }
  if (bin1.length != bin2.length) {
    return false
  }
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] != bin2[i]) {
      return false
    }
  }
  return true
}

const BEGIN = '-----BEGIN OPENSSH PRIVATE KEY-----'
const END = '-----END OPENSSH PRIVATE KEY-----'

/**
 * This function decodes a PEM (Privacy Enhanced Mail) string and returns an object containing the public and private key.
 *
 * @param {string} txt - The PEM string to decode.
 * @returns {Object} An object containing the public and private key, or null if the string could not be decoded.
 */
function decodePEM(txt) {
  const ss = txt.split('\n').map(s => s.trim())
  const ns = ss.indexOf(BEGIN)
  const ne = ss.indexOf(END)
  if (ns < 0 || ne < 0 || ns > ne) {
    return null
  }
  const bin = Base64.decode(ss.slice(ns + 1, ne).join(''))
  if (bin2s(bin, 0x2f, 11) != 'ssh-ed25519') {
    return null
  }
  if (bin2s(bin, 0x6e, 11) != 'ssh-ed25519') {
    return null
  }
  if (bin2i(bin, 0x3a) != 32) {
    return null
  }
  const publicKey = subbin(bin, 0x3e, 32)
  
  // Check for both old format (64-byte) and new format (32-byte) private keys
  const privateKeyLength = bin2i(bin, 0x9d)
  if (privateKeyLength == 64) {
    // Old format: 64-byte private key
    const privateKey = subbin(bin, 0xa1, 64)
    return { publicKey, privateKey }
  } else if (privateKeyLength == 32) {
    // New format: 32-byte private key (corrected)
    const privateSeed = subbin(bin, 0xa1, 32)
    const publicKeyAgain = subbin(bin, 0xa1 + 32, 32)
    // For compatibility, return the expanded 64-byte format (seed + public key)
    const privateKey = new Uint8Array(64)
    privateKey.set(privateSeed, 0)
    privateKey.set(publicKeyAgain, 32)
    return { publicKey, privateKey }
  }
  
  return null
}

/**
 * Splits a long string into multiple lines of a specified character limit
 * @param {string} str - The string to be split
 * @returns {string} The splitted string
 */
function splitLongStrings(str) {
  const charLimit = 70
  let splittedString = ''
  if (str.length > charLimit) {
    for (let i = 0; i < str.length; i++) {
      if (i % charLimit === 0) {
        splittedString += '\n'
      }
      splittedString += str[i]
    }
    return splittedString
  } else {
    return str
  }
}

/**
 * This function encodes a given set of keys in PEM format.
 *
 * @param {Object} keys An object containing the public and private keys.
 * @returns {String} A string representing the encoded PEM format.
 */
function encodePEM(keys) {
  // Use the original format but fix the private key to be 32 bytes instead of 64
  // Keep hardcoded check bytes and structure for compatibility with decodePEM
  // Fixed: private section length should be 0x98 (152 bytes) not 0x90 (144 bytes)
  const pem = `6f70656e7373682d6b65792d763100000000046e6f6e65000000046e6f6e650000000000000001000000330000000b7373682d6564323535313900000020${keys.publicKey}000000980ac771850ac771850000000b7373682d6564323535313900000020${keys.publicKey}00000020${keys.privateKey}${keys.publicKey}000000126d656c76696e406d656c76696e2d504e3632010203`

  return `${BEGIN}${splitLongStrings(hexToBase64(pem))}
${END}`
}

/**
 * Generates various keys and related information from a given private key using different algorithms.
 *
 * @param {string} privateKey - The private key to generate keys from.
 * @returns {Object} An object containing the generated keys and related information.
 * @property {string} privkey - The original private key.
 * @property {string} nsec - The nsec value for the private key.
 * @property {string} pubkey - The public key generated from the private key.
 * @property {string} didnostr - The DID Nostr identifier in the format "did:nostr:<pubkey>".
 * @property {string} pubkeycompressed - The compressed public key generated from the private key.
 * @property {string} npub - The npub value for the public key.
 * @property {string} taproot - The taproot address generated from the public key.
 * @property {string} taproottestnet - The taproot testnet address generated from the public key.
 * @property {string} liquidtaproot - The liquid taproot address generated from the public key.
 * @property {string} ed25519pubkey - The ed25519 public key generated from the private key.
 * @property {string} pubky - The z32 encoded ed25519 public key generated from the private key.
 * @property {string} mnemonic - The BIP39 mnemonic phrase (24 words) derived from the private key.
 * @property {string} openSSHed25519pubkey - The OpenSSH ed25519 public key generated from the private key.
 * @property {string} openSSHed25519privkey - The OpenSSH ed25519 private key generated from the private key.
 */
function getAllKeys(privateKey) {
  const ed25519_prefix = '0000000b7373682d6564323535313900000020'
  const ed25519_ssh_prefix = 'ssh-ed25519'
  const taproot_prefix = 'bc'
  const taproot_testnet_prefix = 'tb'
  const liquid_prefix = 'ex'
  const litecoin_prefix = 'ltc'
  const vertcoin_prefix = 'vtc'

  const publicKey = getPublicKey(privateKey)
  const npub = nip19(publicKey, 'npub')
  // console.log(npub)

  // const ECPair = ECPairFactory(tiny)
  // const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
  // let wif = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
  // let wifTestnet = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: TESTNET })

  // console.log(keyPair.publicKey)
  const ed25519Keypair = nacl.sign.keyPair.fromSeed(hexToBuffer(privateKey))
  const ed25519pubkey = Buffer.from(ed25519Keypair.publicKey).toString('hex')
  // For OpenSSH, use the original 32-byte private key as the Ed25519 seed
  const ed25519seed = privateKey
  // const p = tiny.pointFromScalar(Buffer.from(privateKey, 'hex'))
  // var compressed = bufferToHex(p)
  const compressed = secp256k1.utils.bytesToHex(secp256k1.Point.fromPrivateKey(privateKey).toRawBytes(true))
  const privkeyPEM = encodePEM({ publicKey: ed25519pubkey, privateKey: ed25519seed })
  
  // Generate BIP39 mnemonic and BIP86 keys
  const mnemonic = generateBIP39Mnemonic(privateKey)
  const bip86Keys = generateBIP86Keys(mnemonic)

  const output = {
    privkey: privateKey,
    nsec: nip19(privateKey, 'nsec'),
    pubkey: publicKey,
    didnostr: `did:nostr:${publicKey}`,
    pubkeycompressed: compressed,
    // bitcoinPubkey: wif.address,
    // bitcoinTestnet3Pubkey: wifTestnet.address,
    npub,
    taproot: encodeBytes(taproot_prefix, publicKey),
    taproottestnet: encodeBytes(taproot_testnet_prefix, publicKey),
    liquidtaproot: encodeBytes(liquid_prefix, publicKey),
    litecointaproot: encodeBytes(litecoin_prefix, publicKey),
    vertcointaproot: encodeBytes(vertcoin_prefix, publicKey),
    ed25519pubkey,
    pubky: z32Encode(ed25519pubkey),
    mnemonic,
    bip86_tprv: bip86Keys.tprv,
    bip86_tpub: bip86Keys.tpub,
    bip86_p2tr: bip86Keys.p2tr_address,
    openSSHed25519pubkey: `${ed25519_ssh_prefix} ${hexToBase64(
      ed25519_prefix + ed25519pubkey
    )}`,
    openSSHed25519privkey: privkeyPEM
  }
  return output
}

/**
 * Generates every key and address derivable from an x-only public key alone.
 *
 * Note: the compressed public key is deliberately omitted — the y-parity is
 * unknown from an x-only key, so guessing 02 would silently differ from
 * getAllKeys() for roughly half of all keys.
 *
 * @param {string} publicKey - The x-only public key in hex.
 * @returns {Object} The subset of getAllKeys() output derivable from the public key.
 */
function getPubKeys(publicKey) {
  publicKey = String(publicKey).toLowerCase()
  if (!/^[0-9a-f]{64}$/.test(publicKey)) {
    throw new Error('Invalid public key: expected 32-byte (64 hex chars) x-only key')
  }
  const taproot_prefix = 'bc'
  const taproot_testnet_prefix = 'tb'
  const liquid_prefix = 'ex'
  const litecoin_prefix = 'ltc'
  const vertcoin_prefix = 'vtc'

  return {
    pubkey: publicKey,
    didnostr: `did:nostr:${publicKey}`,
    npub: nip19(publicKey, 'npub'),
    taproot: encodeBytes(taproot_prefix, publicKey),
    taproottestnet: encodeBytes(taproot_testnet_prefix, publicKey),
    liquidtaproot: encodeBytes(liquid_prefix, publicKey),
    litecointaproot: encodeBytes(litecoin_prefix, publicKey),
    vertcointaproot: encodeBytes(vertcoin_prefix, publicKey)
  }
}

export {
  encodeBytes,
  decodeBytes,
  hexToBuffer,
  bufferToHex,
  generate_public_key,
  hexToBase64,
  secp256k1Add,
  encodePEM,
  decodePEM,
  getAllKeys,
  getPubKeys,
  getPublicKey,
  generateBIP39Mnemonic,
  mnemonicToSeed,
  generateBIP86Keys
}
