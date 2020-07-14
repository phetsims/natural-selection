// Copyright 2020, University of Colorado Boulder

/**
 * OrganismNode is the base-class view of a Organism model element. It synchronizes its
 * position and direction with the model, and converts the model's 3D position to a 2D position and scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import naturalSelection from '../../naturalSelection.js';
import Organism from '../model/Organism.js';
import XDirection from '../model/XDirection.js';

class OrganismNode extends Node {

  /**
   * @param {Organism} organism
   * @param {Object} [options]
   */
  constructor( organism, options ) {

    assert && assert( organism instanceof Organism, 'invalid organism' );

    super( options );

    // @public (read-only)
    this.organism = organism;

    // Position and direction, must be disposed
    const multilink = new Multilink(
      [ organism.positionProperty, organism.xDirectionProperty ],
      ( position, xDirection ) => {
        this.resetTransform();
        this.translation = organism.modelViewTransform.modelToViewPosition( position );
        const scale = organism.modelViewTransform.getViewScale( position.z );
        this.setScaleMagnitude( scale * XDirection.toSign( xDirection ), scale );
      } );

    // @private
    this.disposeOrganismNode = () => {
      multilink.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeOrganismNode();
    super.dispose();
  }
}

naturalSelection.register( 'OrganismNode', OrganismNode );
export default OrganismNode;