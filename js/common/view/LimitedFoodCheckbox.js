// Copyright 2019, University of Colorado Boulder

/**
 * LimitedFoodCheckbox is a checkbox for limiting the food that is available.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const limitedFoodString = require( 'string!NATURAL_SELECTION/limitedFood' );

  class LimitedFoodCheckbox extends Checkbox {

    /**
     * @param {Property.<boolean>} limitedFoodProperty
     * @param {Object} [options]
     */
    constructor( limitedFoodProperty, options ) {

      options = merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

      const content = new Text( limitedFoodString, {
        font: NaturalSelectionConstants.CHECKBOX_FONT,
        maxWidth: 150 // determined empirically
      } );

      super( content, limitedFoodProperty, options );
    }
  }

  return naturalSelection.register( 'LimitedFoodCheckbox', LimitedFoodCheckbox );
} );