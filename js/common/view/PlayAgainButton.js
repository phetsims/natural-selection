// Copyright 2019-2020, University of Colorado Boulder

/**
 * PlayAgainButton is the push button that is shown after all bunnies die, or bunnies take over the world.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const playAgainString = require( 'string!NATURAL_SELECTION/playAgain' );

  class PlayAgainButton extends RectangularPushButton {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {}, NaturalSelectionConstants.RECTANGULAR_PUSH_BUTTON_OPTIONS, {
        baseColor: NaturalSelectionColors.ADD_A_MATE_BUTTON,
        xMargin: 12,
        yMargin: 8
      }, options );

      assert && assert( !options.content, 'PlayAgainButton sets content' );
      options.content = new Text( playAgainString, {
        font: NaturalSelectionConstants.PUSH_BUTTON_FONT,
        maxWidth: 150 // determined empirically
      } );

      super( options );
    }
  }

  return naturalSelection.register( 'PlayAgainButton', PlayAgainButton );
} );