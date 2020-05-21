// Copyright 2019-2020, University of Colorado Boulder

/**
 * DataProbeDragListener is the drag listener for the data probe on the Population graph.
 * Historical information and requirements can be found in https://github.com/phetsims/natural-selection/issues/14.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import DragListener from '../../../../../scenery/js/listeners/DragListener.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';

class DataProbeDragListener extends DragListener {

  /**
   * @param {Property.<Vector2>} positionProperty
   * @param {Range} xRange
   * @param {Object} [options]
   */
  constructor( positionProperty, xRange, options ) {

    assert && NaturalSelectionUtils.assertPropertyInstanceof( positionProperty, Vector2 );
    assert && assert( xRange instanceof Range, 'invalid xRange' );

    options = merge( {}, options );

    assert && assert( !options.dragBoundsProperty, 'DataProbeDragListener sets dragBoundsProperty' );
    options.dragBoundsProperty = new Property( new Bounds2( xRange.min, 0, xRange.max, 0 ) );

    assert && assert( !options.positionProperty, 'DataProbeDragListener sets positionProperty' );
    options.positionProperty = positionProperty;

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'DataProbeDragListener does not support dispose' );
  }
}

naturalSelection.register( 'DataProbeDragListener', DataProbeDragListener );
export default DataProbeDragListener;