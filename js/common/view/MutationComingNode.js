// Copyright 2019, University of Colorado Boulder

/**
 * MutationComingNode is a pseudo dialog. It informs the user that a mutation is about to be applied, and gives
 * the user an opportunity to cancel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );

  // images
  const mutationIcon = require( 'image!NATURAL_SELECTION/mutationIcon.png' );

  // strings
  const cancelString = require( 'string!NATURAL_SELECTION/cancel' );
  const mutationComingString = require( 'string!NATURAL_SELECTION/mutationComing' );

  // constants
  const X_MARGIN = 10;
  const Y_MARGIN = 10;

  class MutationComingNode extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        cancelButtonListener: null
      }, options );

      const iconNode = new Image( mutationIcon, { scale: 0.75 } );

      const textNode = new Text( mutationComingString, { font: NaturalSelectionConstants.TEXT_FONT } );

      const cancelButton = new RectangularPushButton( merge( {},
        NaturalSelectionConstants.RECTANGULAR_PUSH_BUTTON_OPTIONS, {
          baseColor: NaturalSelectionColors.CANCEL_BUTTON,
          content: new Text( cancelString, { font: NaturalSelectionConstants.PUSH_BUTTON_FONT } ),
          listener: options.cancelButtonListener
        } ) );

      const hBox = new HBox( {
        spacing: 15,
        children: [ iconNode, textNode, cancelButton ]
      } );

      const background = new Rectangle( 0, 0, hBox.width + 2 * X_MARGIN, hBox.height + 2 * Y_MARGIN, {
        cornerRadius: 2,
        stroke: 'black',
        fill: 'rgb( 200, 200, 200 )',
        opacity: 0.5,
        center: hBox.center
      } );

      assert && assert( !options.children, 'MutationComingNode sets children' );
      options.children = [ background, hBox ];

      super( options );
    }
  }

  return naturalSelection.register( 'MutationComingNode', MutationComingNode );
} );