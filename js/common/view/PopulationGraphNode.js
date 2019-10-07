// Copyright 2019, University of Colorado Boulder

/**
 * PopulationGraphNode displays the population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // const
  const X_MARGIN = 5;
  const Y_MARGIN = 5;
  const ZOOM_BUTTON_OPTIONS = {
    radius: 6
  };

  class PopulationGraphNode extends Node {

    /**
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     */
    constructor( width, height, options ) {

      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, width, height, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE
      } );

      //TODO placeholder
      const text = new Text( 'Population', {
        font: NaturalSelectionConstants.TITLE_FONT,
        center: rectangle.center
      } );

      const zoomInButton = new ZoomButton( _.extend( {}, ZOOM_BUTTON_OPTIONS, {
        in: true,
        listener: () => {
          //TODO
        }
      } ) );

      const zoomOutButton = new ZoomButton( _.extend( {}, ZOOM_BUTTON_OPTIONS, {
        in: false,
        listener: () => {
          //TODO
        }
      } ) );

      const zoomButtonsParent = new HBox( {
        children: [ zoomInButton, zoomOutButton ],
        spacing: 5,
        left: rectangle.left + X_MARGIN,
        top: rectangle.top + Y_MARGIN
      } );

      assert && assert( !options.children, 'PopulationGraphNode sets children' );
      options.children = [ rectangle, zoomButtonsParent, text ];

      super( options );
    }
  }

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );