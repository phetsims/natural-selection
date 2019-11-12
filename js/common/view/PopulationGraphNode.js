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
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // strings
  const generationString = require( 'string!NATURAL_SELECTION/generation' );
  const populationString = require( 'string!NATURAL_SELECTION/population' );
  
  // const
  const X_MARGIN = 5;
  const Y_MARGIN = 5;
  const ZOOM_BUTTON_OPTIONS = {
    radius: 6,
    baseColor: NaturalSelectionColors.ZOOM_BUTTONS
  };
  const AXIS_LABEL_FONT = new PhetFont( 14 );

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

      // x-axis label
      const xAxisLabelNode = new Text( generationString, {
        font: AXIS_LABEL_FONT,
        centerX: rectangle.centerX,
        bottom: rectangle.bottom - 8
      } );

      // y-axis label
      const yAxisLabelNode = new Text( populationString, {
        font: AXIS_LABEL_FONT,
        rotation: -Math.PI / 2,
        left: rectangle.left + 8,
        centerY: rectangle.centerY
      } );

      const zoomInButton = new ZoomButton( merge( {}, ZOOM_BUTTON_OPTIONS, {
        in: true,
        listener: () => {
          //TODO
        }
      } ) );

      const zoomOutButton = new ZoomButton( merge( {}, ZOOM_BUTTON_OPTIONS, {
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
      options.children = [ rectangle, zoomButtonsParent, xAxisLabelNode, yAxisLabelNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'PopulationGraphNode', PopulationGraphNode );
} );