// Copyright 2019, University of Colorado Boulder

/**
 * DiedDialog is displayed when all of the bunnies have died.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const allOfTheBunniesHaveDiedString = require( 'string!NATURAL_SELECTION/allOfTheBunniesHaveDied' );

  class DiedDialog extends Dialog {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
       topMargin: 50,
       bottomMargin: 50
      }, options );

      const messageText = new Text( allOfTheBunniesHaveDiedString, {
        font: NaturalSelectionConstants.DIALOG_FONT,
        scale: NaturalSelectionConstants.DIALOG_CONTENT_SCALE
      } );

      super( messageText, options );
    }
  }

  return naturalSelection.register( 'DiedDialog', DiedDialog );
} );