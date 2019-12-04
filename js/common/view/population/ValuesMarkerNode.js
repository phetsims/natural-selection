// Copyright 2019, University of Colorado Boulder

/**
 * ValuesMarkerNode displays y-axis values at an x-axis position.  It can be dragged along the x axis.
 * The origin is at the top center of barNode.
 * Historical information and requirements can be found in https://github.com/phetsims/natural-selection/issues/14.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionUtils = require( 'NATURAL_SELECTION/common/NaturalSelectionUtils' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const Shape = require( 'KITE/Shape' );
  const ValuesMarkerDragListener = require( 'NATURAL_SELECTION/common/view/population/ValuesMarkerDragListener' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  // constants
  const BAR_COLOR = 'rgb( 120, 120, 120 )';
  const NUMBER_DISPLAY_RANGE = new Range( 0, NaturalSelectionConstants.MAX_BUNNIES );
  const NUMBER_DISPLAY_FONT = new PhetFont( 12 );
  const NUMBER_DISPLAY_LINE_WIDTH = 2;
  const NUMBER_DISPLAY_LINE_DASH = [ 3, 3 ];
  const NUMBER_DISPLAY_NO_VALUE_STRING = '?'; //TODO what to display when there is no data
  const NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY = 0.7;
  const NUMBER_DISPLAY_DASHED_BACKGROUND_FILL = new Color( 255, 255, 255, NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY );
  const MANIPULATOR_RADIUS = 6;

  class ValuesMarkerNode extends Node {

    /**
     * @param {populationModel} populationModel
     * @param {number} originX TODO make this go away
     * @param {number} graphWidth
     * @param {number} graphHeight
     * @param {Object} [options]
     */
    constructor( populationModel, originX, graphWidth, graphHeight, options ) {

      options = merge( {
        cursor: 'ew-resize' // <->
      }, options );

      // Vertical bar
      const barNode = new Rectangle( 0, 0, 3, graphHeight, {
        fill: BAR_COLOR,
        centerX: 0,
        y: 0
      } );
      barNode.mouseArea = barNode.localBounds.dilatedXY( 5, 0 );
      barNode.touchArea = barNode.localBounds.dilatedXY( 10, 0 );

      // Manipulator at bottom of bar
      const manipulator = new ShadedSphereNode( 2 * MANIPULATOR_RADIUS, {
        mouseArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
        touchArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
        center: barNode.centerBottom
      } );

      // NumberDisplay instances
      const totalDisplay = createSolidNumberDisplay( populationModel.totalCountProperty, NaturalSelectionColors.TOTAL_POPULATION );
      const whiteFurDisplay = createSolidNumberDisplay( populationModel.whiteFurCountProperty, NaturalSelectionColors.FUR );
      const brownFurDisplay = createDashedNumberDisplay( populationModel.brownFurCountProperty, NaturalSelectionColors.FUR );
      const straightEarsDisplay = createSolidNumberDisplay( populationModel.straightEarsCountProperty, NaturalSelectionColors.EARS );
      const floppyEarsDisplay = createDashedNumberDisplay( populationModel.floppyEarsCountProperty, NaturalSelectionColors.EARS );
      const shortTeethDisplay = createSolidNumberDisplay( populationModel.shortTeethCountProperty, NaturalSelectionColors.TEETH );
      const longTeethDisplay = createDashedNumberDisplay( populationModel.longTeethCountProperty, NaturalSelectionColors.TEETH );

      // vertical layout of NumberDisplays 
      const numberDisplays = new VBox( {
        spacing: 3,
        align: 'left'
        // children set in multilink below
      } );

      // for adding a bit of space above the NumberDisplays
      const vStrut = new VStrut( 5 );

      // horizontal layout of bar and NumberDisplays
      const hBox = new HBox( {
        spacing: 0,
        align: 'top',
        children: [ barNode, numberDisplays ]
      } );

      assert && assert( !options.children, 'ValuesMarkerNode sets children' );
      options.children = [ hBox, manipulator ];

      super( options );

      // @private location in view coordinate frame, relative to the left edge of the graph
      this.locationProperty = new Property( new Vector2( originX, 0 ) );

      this.addInputListener( new ValuesMarkerDragListener( this.locationProperty, new Range( originX, originX + graphWidth ), {
        pressCursor: options.cursor
      } ) );

      // visibility of Values Marker
      populationModel.valuesMarkerVisibleProperty.link( valuesMarkerVisible => {
        this.interruptSubtreeInput(); // cancel interactions
        this.visible = valuesMarkerVisible;
      } );

      this.locationProperty.link( location => {
        this.x = location.x;
        //TODO update display
        //TODO flip flags around y axis at edges of graph
      } );

      // When visibility of some quantity changes, change which NumberDisplays are children of numberDisplays.
      Property.multilink( [
          populationModel.totalVisibleProperty,
          populationModel.whiteFurVisibleProperty,
          populationModel.brownFurVisibleProperty,
          populationModel.straightEarsVisibleProperty,
          populationModel.floppyEarsVisibleProperty,
          populationModel.shortTeethVisibleProperty,
          populationModel.longTeethVisibleProperty
        ],
        (
          totalVisible,
          whiteFurVisible,
          brownFurVisible,
          straightEarsVisible,
          floppyEarsVisible,
          shortTeethVisible,
          longTeethVisible
        ) => {
          const children = [ vStrut ];

          // Order is important here. It should match the vertical order in PopulationControlPanel.
          totalVisible && children.push( totalDisplay );
          whiteFurVisible && children.push( whiteFurDisplay );
          brownFurVisible && children.push( brownFurDisplay );
          straightEarsVisible && children.push( straightEarsDisplay );
          floppyEarsVisible && children.push( floppyEarsDisplay );
          shortTeethVisible && children.push( shortTeethDisplay );
          longTeethVisible && children.push( longTeethDisplay );
          numberDisplays.children = children;
        } );
    }

    /**
     * @public
     */
    reset() {
      this.xProperty.reset();
    }
  }

  /**
   * Creates a NumberDisplay whose background is filled with a solid color.
   * @param {Property.<number>} numberProperty
   * @param color
   * @returns {NumberDisplay}
   */
  function createSolidNumberDisplay( numberProperty, color ) {
    const colorWithAlpha = Color.toColor( color ).withAlpha( NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY );
    return new NumberDisplay( numberProperty, NUMBER_DISPLAY_RANGE, {
      font: NUMBER_DISPLAY_FONT,
      numberFill: NaturalSelectionUtils.isDarkColor( colorWithAlpha ) ? 'white' : 'black',
      backgroundFill: colorWithAlpha,
      backgroundStroke: colorWithAlpha,  // also set stroke, so all NumberDisplay have same dimensions
      backgroundLineWidth: NUMBER_DISPLAY_LINE_WIDTH,
      noValueString: NUMBER_DISPLAY_NO_VALUE_STRING
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
      numberFill: NaturalSelectionUtils.isDarkColor( NUMBER_DISPLAY_DASHED_BACKGROUND_FILL ) ? 'white' : 'black',
      backgroundFill: NUMBER_DISPLAY_DASHED_BACKGROUND_FILL,
      backgroundStroke: color,
      backgroundLineDash: NUMBER_DISPLAY_LINE_DASH,
      backgroundLineWidth: NUMBER_DISPLAY_LINE_WIDTH,
      noValueString: NUMBER_DISPLAY_NO_VALUE_STRING
    } );
  }

  return naturalSelection.register( 'ValuesMarkerNode', ValuesMarkerNode );
} );