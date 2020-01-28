// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionViewProperties contains view-specific Properties that are common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Graphs = require( 'NATURAL_SELECTION/common/view/Graphs' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const Tandem = require( 'TANDEM/Tandem' );

  class NaturalSelectionViewProperties {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      // @public
      this.graphProperty = new EnumerationProperty( Graphs, Graphs.POPULATION, {
        tandem: tandem.createTandem( 'graphProperty' )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.graphProperty.reset();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'NaturalSelectionViewProperties does not support dispose' );
    }
  }

  return naturalSelection.register( 'NaturalSelectionViewProperties', NaturalSelectionViewProperties );
} );