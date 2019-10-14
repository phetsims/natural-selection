// Copyright 2019, University of Colorado Boulder

/**
 * AbioticEnvironments is an enumeration of the abiotic environments where the bunnies may live.
 * The abiotic environment includes the non-living chemical and physical parts of an environment,
 * e.g. water, light, radiation, temperature, humidity, atmosphere, acidity, and soil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  const AbioticEnvironments = new Enumeration( [ 'EQUATOR', 'ARCTIC' ] );

  return naturalSelection.register( 'AbioticEnvironments', AbioticEnvironments );
} );