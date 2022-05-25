import {AbstractGraph, Attributes} from 'graphology-types';

export interface WeightedEdgeAttributes extends Attributes {
  weight: number;
}

export type WeightedGraph = AbstractGraph<Attributes, WeightedEdgeAttributes>;
