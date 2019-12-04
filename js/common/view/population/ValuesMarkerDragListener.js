// Copyright 2019, University of Colorado Boulder

/**
 * ValuesMarkerDragListener is the drag listener for the Values Marker.
 * Historical information and requirements can be found in https://github.com/phetsims/natural-selection/issues/14.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Property = require( 'AXON/Property' );

  class ValuesMarkerDragListener extends DragListener {

    /**
     * @param {Property.<Vector2>} locationProperty
     * @param {Range} xRange
     * @param {Object} [options]
     */
    constructor( locationProperty, xRange, options ) {

      options = merge( {}, options );

      assert && assert( !options.dragBoundsProperty, 'ValuesMarkerDragListener sets dragBoundsProperty' );
      options.dragBoundsProperty = new Property( new Bounds2( xRange.min, 0, xRange.max, 0 ) );

      assert && assert( !options.locationProperty, 'ValuesMarkerDragListener sets locationProperty' );
      options.locationProperty = locationProperty;

      super( options );
    }
  }

  return naturalSelection.register( 'ValuesMarkerDragListener', ValuesMarkerDragListener );
} );