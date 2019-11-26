// Copyright 2019, University of Colorado Boulder

/**
 * Graphs is an enumeration of the graph types that are available in the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  const Graphs = new Enumeration( [ 'POPULATION', 'PROPORTIONS', 'PEDIGREE' ] );

  return naturalSelection.register( 'Graphs', Graphs );
} );