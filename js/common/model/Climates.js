// Copyright 2019, University of Colorado Boulder

/**
 * Climates is an enumeration of the climates where the bunnies may live.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  const Climates = new Enumeration( [ 'EQUATOR', 'ARCTIC' ] );

  return naturalSelection.register( 'Climates', Climates );
} );