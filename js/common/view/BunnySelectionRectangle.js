// Copyright 2020, University of Colorado Boulder

/**
 * BunnySelectionRectangle is the rectangle that appears around the selected bunny in the environment and
 * in the Pedigree graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class BunnySelectionRectangle extends Rectangle {

  /**
   * @param {Bounds2} bounds
   * @param {Object} [options]
   */
  constructor( bounds, options ) {

    assert && assert( bounds instanceof Bounds2, 'invalid bounds' );

    options = merge( {
      fill: 'rgba( 0, 0, 0, 0.25 )',
      stroke: NaturalSelectionColors.SELECTED_BUNNY_STROKE,
      lineWidth: 2,
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      pickable: false
    }, options );

    super( bounds, options );
  }
}

naturalSelection.register( 'BunnySelectionRectangle', BunnySelectionRectangle );
export default BunnySelectionRectangle;