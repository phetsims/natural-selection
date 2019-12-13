// Copyright 2019, University of Colorado Boulder

//TODO adjust margins, spacing, and maxWidth after integration final artwork
/**
 * WorldDialog is displayed when all the bunnies have taken over the world.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // images
  const worldImage = require( 'image!NATURAL_SELECTION/world.png' );

  // strings
  const bunniesHaveTakenOverTheWorldString = require( 'string!NATURAL_SELECTION/bunniesHaveTakenOverTheWorld' );

  class WorldDialog extends Dialog {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        fill: 'black',
        closeButtonColor: 'white',
        topMargin: 25
      }, options );

      const worldNode = new Image( worldImage, {
        scale: 0.8 // determined empirically
      } );

      const messageText = new Text( bunniesHaveTakenOverTheWorldString, {
        font: NaturalSelectionConstants.DIALOG_FONT,
        fill: 'white',
        maxWidth: worldNode.width
      } );

      const content = new VBox( {
        spacing: 25,
        align: 'center',
        children: [ messageText, worldNode ],
        scale: NaturalSelectionConstants.DIALOG_CONTENT_SCALE
      } );

      super( content, options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'WorldDialog does not support dispose' );
    }
  }

  return naturalSelection.register( 'WorldDialog', WorldDialog );
} );