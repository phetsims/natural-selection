// Copyright 2019, University of Colorado Boulder

/**
 * MutationComingNode is a pseudo non-modal dialog. It informs the user that a mutation is about to be occur,
 * and gives the user an opportunity to cancel the mutation.  It is not implemented using SUN/Dialog because
 * (at the time of implementation) non-modal dialogs are not yet supported.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const CancelMutationButton = require( 'NATURAL_SELECTION/common/view/CancelMutationButton' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );

  // images
  const mutationIconImage = require( 'image!NATURAL_SELECTION/mutationIcon.png' );

  // strings
  const mutationComingString = require( 'string!NATURAL_SELECTION/mutationComing' );

  // constants
  const X_MARGIN = 8;
  const Y_MARGIN = 4;
  const POINTER_WIDTH = 15;

  class MutationComingNode extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        cancelButtonListener: null
      }, options );

      const cancelButton = new CancelMutationButton();

      const iconNode = new Image( mutationIconImage, { scale: 0.2 } );

      const textNode = new Text( mutationComingString, { font: NaturalSelectionConstants.TEXT_FONT } );

      const hBox = new HBox( {
        spacing: 12,
        children: [
          cancelButton,
          new HBox( {
            spacing: 4,
            children: [ iconNode, textNode ]
          } )
        ]
      } );

      const backgroundWidth = hBox.width + 2 * X_MARGIN;
      const backgroundHeight = hBox.height + 2 * Y_MARGIN;
      const backgroundShape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( backgroundWidth, 0 )
        .lineTo( backgroundWidth + POINTER_WIDTH, backgroundHeight / 2 )
        .lineTo( backgroundWidth, backgroundHeight )
        .lineTo( 0, backgroundHeight )
        .close();
      const backgroundPath = new Path( backgroundShape, {
        stroke: 'black',
        fill: 'rgba( 255, 255, 255, 0.75 )'
      } );
      
      // Center content in the background
      hBox.left = backgroundPath.left + X_MARGIN;
      hBox.centerY = backgroundPath.centerY;

      assert && assert( !options.children, 'MutationComingNode sets children' );
      options.children = [ backgroundPath, hBox ];

      super( options );
    }
  }

  return naturalSelection.register( 'MutationComingNode', MutationComingNode );
} );