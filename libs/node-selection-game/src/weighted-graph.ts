import {AbstractGraph, Attributes} from 'graphology-types';

export interface WeightedEdgeAttributes extends Attributes {
  weight?: number;
}

/**
 * A graph in which a number (the weight) is assigned to each edge.
 */
export type WeightedGraph = AbstractGraph<Attributes, WeightedEdgeAttributes>;
