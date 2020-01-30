// Copyright 2019-2020, University of Colorado Boulder

/**
 * ToughFoodCheckbox is a checkbox for enabling the 'tough food' environmental factor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const toughFoodString = require( 'string!NATURAL_SELECTION/toughFood' );

  // images
  const toughFoodCImage = require( 'image!NATURAL_SELECTION/toughFoodC.png' );

  class ToughFoodCheckbox extends Checkbox {

    /**
     * @param {Property.<boolean>} wolvesEnabledProperty
     * @param {Object} [options]
     */
    constructor( wolvesEnabledProperty, options ) {

      options = merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

      const text = new Text( toughFoodString, {
        font: NaturalSelectionConstants.CHECKBOX_FONT,
        maxWidth: 110 // determined empirically
      } );

      const icon = new Image( toughFoodCImage, { scale: 0.2 } );

      const content = new HBox( {
        spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING,
        children: [ text, icon ]
      } );

      super( content, wolvesEnabledProperty, options );
    }
  }

  return naturalSelection.register( 'ToughFoodCheckbox', ToughFoodCheckbox );
} );