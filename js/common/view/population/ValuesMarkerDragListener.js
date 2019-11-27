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
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class ValuesMarkerDragListener extends DragListener {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {
      //TODO
      super( options );
    }
  }

  return naturalSelection.register( 'ValuesMarkerDragListener', ValuesMarkerDragListener );
} );