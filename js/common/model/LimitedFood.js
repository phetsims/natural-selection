// Copyright 2019, University of Colorado Boulder

/**
 * TODO
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnvironmentalFactor = require( 'NATURAL_SELECTION/common/model/EnvironmentalFactor' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  class LimitedFood extends EnvironmentalFactor {

    /**
     * @param {Food[]} food
     * @param {Tandem} tandem
     */
    constructor( food, tandem ) {
      super( tandem );

      // When enabled, cut the food supply in half
      this.enabledProperty.link( enabled => {
        for ( let i = 0; i < food.length; i++ ) {
          food[ i ].existsProperty.value = ( i % 2 === 0 || !enabled );
        }
      } );
    }
  }

  return naturalSelection.register( 'LimitedFood', LimitedFood );
} );