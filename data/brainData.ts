import { BrainData } from '../types';

// Coordinates manually tuned to look like a side-profile brain
// x: 0 (left/back) to 100 (right/front)
// y: 0 (top) to 100 (bottom)

export const brainData: BrainData = {
  nodes: [
    // --- Frontal Lobe (Application/High Level) ---
    { id: 'ai', label: 'Artificial Intelligence', category: 'application', description: 'Simulating human intelligence in machines.', x: 85, y: 30 },
    { id: 'ml', label: 'Machine Learning', category: 'application', description: 'Algorithms that improve automatically through experience.', x: 75, y: 20 },
    { id: 'nlp', label: 'NLP', category: 'application', description: 'Interaction between computers and human language.', x: 90, y: 45 },
    { id: 'web', label: 'Web Systems', category: 'application', description: 'Architecture of the world wide web.', x: 78, y: 40 },
    
    // --- Parietal/Top (Logic/Math) ---
    { id: 'algo', label: 'Algorithms', category: 'fundamental', description: 'Step-by-step procedures for calculations.', x: 50, y: 10 },
    { id: 'ds', label: 'Data Structures', category: 'fundamental', description: 'Data organization, management, and storage formats.', x: 60, y: 15 },
    { id: 'calc', label: 'Calculus', category: 'fundamental', description: 'Mathematical study of continuous change.', x: 40, y: 12 },
    { id: 'graph', label: 'Graph Theory', category: 'fundamental', description: 'Study of graphs and pairwise relations.', x: 55, y: 25 },
    
    // --- Occipital/Back (Visual/Low Level) ---
    { id: 'os', label: 'Operating Systems', category: 'systems', description: 'System software that manages computer hardware.', x: 20, y: 35 },
    { id: 'arch', label: 'Computer Arch', category: 'systems', description: 'Functionality and organization of computer systems.', x: 15, y: 50 },
    { id: 'net', label: 'Networking', category: 'systems', description: 'Interconnection of computing devices.', x: 25, y: 45 },
    { id: 'dist', label: 'Distributed Systems', category: 'systems', description: 'Components located on networked computers.', x: 35, y: 30 },

    // --- Temporal/Middle-Bottom (Memory/Data) ---
    { id: 'db', label: 'Databases', category: 'data', description: 'Organized collection of structured information.', x: 65, y: 55 },
    { id: 'sql', label: 'SQL & Relational', category: 'data', description: 'Language for managing data in RDBMS.', x: 55, y: 60 },
    { id: 'sysDes', label: 'System Design', category: 'systems', description: 'Defining the architecture and interfaces.', x: 45, y: 45 },
    
    // --- Cerebellum/Bottom Back (Coordination) ---
    { id: 'linAlg', label: 'Linear Algebra', category: 'fundamental', description: 'Study of vectors and linear transformations.', x: 25, y: 70 },
    { id: 'stats', label: 'Statistics', category: 'fundamental', description: 'Collection, analysis, interpretation of data.', x: 35, y: 75 },
    { id: 'opt', label: 'Optimization', category: 'fundamental', description: 'Selection of a best element from a set.', x: 40, y: 65 },

    // --- Brain Stem (Foundation) ---
    { id: 'c', label: 'C / Assembly', category: 'systems', description: 'Low-level programming languages.', x: 45, y: 85 },
    { id: 'comp', label: 'Compilers', category: 'systems', description: 'Translating source code into machine code.', x: 50, y: 90 },
  ],
  links: [
    // Frontal Connections
    { source: 'ai', target: 'ml' },
    { source: 'ml', target: 'linAlg' }, // Deep learning needs linear algebra
    { source: 'ml', target: 'stats' },
    { source: 'nlp', target: 'ai' },
    { source: 'web', target: 'dist' },
    { source: 'web', target: 'db' },

    // Logic/Math Connections
    { source: 'algo', target: 'ds' },
    { source: 'algo', target: 'graph' },
    { source: 'calc', target: 'opt' },
    { source: 'graph', target: 'net' }, // Graphs used in networking

    // Systems/Back Connections
    { source: 'os', target: 'arch' },
    { source: 'os', target: 'c' },
    { source: 'net', target: 'os' },
    { source: 'dist', target: 'net' },
    { source: 'dist', target: 'db' },

    // Data/Middle Connections
    { source: 'db', target: 'sql' },
    { source: 'db', target: 'os' }, // DB relies on OS fs
    { source: 'sysDes', target: 'db' },
    { source: 'sysDes', target: 'dist' },
    { source: 'sysDes', target: 'web' },

    // Cross-Brain Connections (The "Mesh")
    { source: 'ml', target: 'algo' },
    { source: 'ds', target: 'db' },
    { source: 'c', target: 'comp' },
    { source: 'arch', target: 'comp' },
    { source: 'linAlg', target: 'calc' },
    { source: 'opt', target: 'ml' },
  ]
};