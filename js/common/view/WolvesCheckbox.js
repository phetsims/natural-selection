// Copyright 2019, University of Colorado Boulder

/**
 * WolvesCheckbox is a checkbox for enabling the 'wolves' selection agent.
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
  const wolvesString = require( 'string!NATURAL_SELECTION/wolves' );

  // images
  const wolfIcon = require( 'image!NATURAL_SELECTION/wolfIcon.png' );

  class WolvesCheckbox extends Checkbox {

    /**
     * @param {Property.<boolean>} wolvesEnabledProperty
     * @param {Object} [options]
     */
    constructor( wolvesEnabledProperty, options ) {

      options = merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, options );

      const content = new HBox( {
        spacing: NaturalSelectionConstants.CHECKBOX_X_SPACING,
        children: [
          new Text( wolvesString, {
            font: NaturalSelectionConstants.CHECKBOX_FONT,
            maxWidth: 110 // determined empirically
          } ),
          new Image( wolfIcon, { scale: 0.4 } )
        ]
      });

      super( content, wolvesEnabledProperty, options );
    }
  }

  return naturalSelection.register( 'WolvesCheckbox', WolvesCheckbox );
} );