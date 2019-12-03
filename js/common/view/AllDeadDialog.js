// Copyright 2019, University of Colorado Boulder

/**
 * AllDeadDialog is displayed when all of the bunnies have died.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const Dialog = require( 'SUN/Dialog' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const allOfTheBunniesHaveDiedString = require( 'string!NATURAL_SELECTION/allOfTheBunniesHaveDied' );

  class AllDeadDialog extends Dialog {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
       topMargin: 50,
       bottomMargin: 50
      }, options );

      const messageText = new Text( allOfTheBunniesHaveDiedString, {
        font: NaturalSelectionConstants.DIALOG_FONT
      } );

      super( messageText, options );

      this.messageText = messageText; //TODO delete
    }
  }

  return naturalSelection.register( 'AllDeadDialog', AllDeadDialog );
} );