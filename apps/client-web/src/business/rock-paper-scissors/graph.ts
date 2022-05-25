import {DirectedGraph} from 'graphology';
import {SvgIconProps} from '@mui/material';
import {WeightedEdgeAttributes} from '@zukte/node-selection-game';

export interface NodeAttributes {
  createElement: (props: SvgIconProps) => JSX.Element;
}

/**
 * A weighted-directed graph which associate an icon with each node.
 */
export class GraphExtension extends DirectedGraph<
  NodeAttributes,
  WeightedEdgeAttributes
> {}
