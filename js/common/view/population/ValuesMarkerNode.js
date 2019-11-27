// Copyright 2019, University of Colorado Boulder

/**
 * ValuesMarkerNode displays y-axis values at an x-axis positions.  It can be dragged along the x axis.
 * Historical information and requirements can be found in https://github.com/phetsims/natural-selection/issues/14.
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
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const Shape = require( 'KITE/Shape' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  // constants
  const NUMBER_DISPLAY_RANGE = new Range( 0, NaturalSelectionConstants.MAX_BUNNIES );
  const NUMBER_DISPLAY_FONT = new PhetFont( 12 );
  const NUMBER_DISPLAY_LINE_WIDTH = 2;
  const NUMBER_DISPLAY_LINE_DASH = [ 3, 3 ];
  const MANIPULATOR_RADIUS = 5;

  class ValuesMarkerNode extends Node {

    /**
     * @param {populationModel} populationModel
     * @param {number} graphHeight
     * @param {Object} [options]
     */
    constructor( populationModel, graphHeight, options ) {

      options = merge( {
        cursor: 'ew-resize' // <->
      }, options );

      const shaftNode = new Rectangle( 0, 0, 3, graphHeight, {
        fill: 'rgb( 120, 120, 120 )'
      } );
      shaftNode.mouseArea = shaftNode.localBounds.dilatedXY( 5, 0 );
      shaftNode.touchArea = shaftNode.localBounds.dilatedXY( 10, 0 );

      // NumberDisplay instances
      const totalDisplay = createSolidNumberDisplay( populationModel.totalCountProperty, NaturalSelectionColors.TOTAL_POPULATION );
      const whiteFurDisplay = createSolidNumberDisplay( populationModel.whiteFurCountProperty, NaturalSelectionColors.FUR );
      const brownFurDisplay = createDashedNumberDisplay( populationModel.brownFurCountProperty, NaturalSelectionColors.FUR );
      const straightEarsDisplay = createSolidNumberDisplay( populationModel.straightEarsCountProperty, NaturalSelectionColors.EARS );
      const floppyEarsDisplay = createDashedNumberDisplay( populationModel.floppyEarsCountProperty, NaturalSelectionColors.EARS );
      const shortTeethDisplay = createSolidNumberDisplay( populationModel.shortTeethCountProperty, NaturalSelectionColors.TEETH );
      const longTeethDisplay = createDashedNumberDisplay( populationModel.longTeethCountProperty, NaturalSelectionColors.TEETH );

      const numberDisplays = new VBox( {
        spacing: 2,
        align: 'left',
        children: [
          new VStrut( 5 ), // to add a bit of space at the top
          totalDisplay,
          whiteFurDisplay,
          brownFurDisplay,
          straightEarsDisplay,
          floppyEarsDisplay,
          shortTeethDisplay,
          longTeethDisplay
        ]
      } );

      const hBox = new HBox( {
        spacing: 0,
        align: 'top',
        children: [ shaftNode, numberDisplays ]
      } );

      const manipulator = new ShadedSphereNode( 2 * MANIPULATOR_RADIUS, {
        mouseArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
        touchArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
        center: shaftNode.centerBottom
      } );

      assert && assert( !options.children, 'ValuesMarkerNode sets children' );
      options.children = [ hBox, manipulator ];

      super( options );

      this.addInputListener( {
        //TODO
      } );
    }
  }

  /**
   * Creates a NumberDisplay whose background is filled with a solid color.
   * @param {Property.<number>} numberProperty
   * @param color
   * @returns {NumberDisplay}
   */
  function createSolidNumberDisplay( numberProperty, color ) {
    return new NumberDisplay( numberProperty, NUMBER_DISPLAY_RANGE, {
      font: NUMBER_DISPLAY_FONT,
      numberFill: 'white', //TODO assumes that @param color is a dark color
      backgroundFill: color,
      backgroundStroke: color,
      backgroundLineWidth: NUMBER_DISPLAY_LINE_WIDTH
    } );
  }

  /**
   * Creates a NumberDisplay whose background is stroked with a dashed line.
   * @param {Property.<number>} numberProperty
   * @param color
   * @returns {NumberDisplay}
   */
  function createDashedNumberDisplay( numberProperty, color ) {
    return new NumberDisplay( numberProperty, NUMBER_DISPLAY_RANGE, {
      font: NUMBER_DISPLAY_FONT,
      numberFill: 'black',
      backgroundFill: 'white',
      backgroundStroke: color,
      backgroundLineDash: NUMBER_DISPLAY_LINE_DASH,
      backgroundLineWidth: NUMBER_DISPLAY_LINE_WIDTH
    } );
  }

  return naturalSelection.register( 'ValuesMarkerNode', ValuesMarkerNode );
} );