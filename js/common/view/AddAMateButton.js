// Copyright 2019, University of Colorado Boulder

/**
 * AddAMateButton is the push button that adds a mate for the sole bunny that exists at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const addAMateString = require( 'string!NATURAL_SELECTION/addAMate' );

  class AddAMateButton extends RectangularPushButton {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        baseColor: NaturalSelectionColors.ADD_A_MATE_BUTTON
      }, NaturalSelectionConstants.RECTANGULAR_PUSH_BUTTON_OPTIONS, options );

      assert && assert( !options.content, 'AddAMateButton sets content' );
      options.content = new Text( addAMateString, {
        font: NaturalSelectionConstants.PUSH_BUTTON_FONT
      } );

      super( options );
    }
  }

  return naturalSelection.register( 'AddAMateButton', AddAMateButton );
} );