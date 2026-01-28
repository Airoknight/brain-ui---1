export interface Node {
  id: string;
  label: string;
  category: 'fundamental' | 'systems' | 'data' | 'application';
  description: string;
  x: number; // 0-100 normalized coordinate
  y: number; // 0-100 normalized coordinate
}

export interface Link {
  source: string;
  target: string;
}

export interface BrainData {
  nodes: Node[];
  links: Link[];
}