// Copyright 2019, University of Colorado Boulder

//TODO rename locationProperty to positionProperty when https://github.com/phetsims/phet-info/issues/126 has been addressed for DragListener
/**
 * DataProbeDragListener is the drag listener for the data probe on the Population graph.
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

  class DataProbeDragListener extends DragListener {

    /**
     * @param {Property.<Vector2>} locationProperty
     * @param {Range} xRange
     * @param {Object} [options]
     */
    constructor( locationProperty, xRange, options ) {

      options = merge( {}, options );

      assert && assert( !options.dragBoundsProperty, 'DataProbeDragListener sets dragBoundsProperty' );
      options.dragBoundsProperty = new Property( new Bounds2( xRange.min, 0, xRange.max, 0 ) );

      assert && assert( !options.locationProperty, 'DataProbeDragListener sets locationProperty' );
      options.locationProperty = locationProperty;

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

  return naturalSelection.register( 'DataProbeDragListener', DataProbeDragListener );
} );