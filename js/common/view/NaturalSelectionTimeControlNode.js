// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionTimeControlNode is a specialization of TimeControlNode for this sim.
 * It allows the user to play, pause, and step the simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );

  class NaturalSelectionTimeControlNode extends TimeControlNode {

    /**
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Object} [options]
     */
    constructor( isPlayingProperty, options ) {

      options = merge( {
        //TODO
      }, options );

      super( isPlayingProperty, options );
    }
  }

  return naturalSelection.register( 'NaturalSelectionTimeControlNode', NaturalSelectionTimeControlNode );
} );