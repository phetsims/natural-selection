// Copyright 2019-2020, University of Colorado Boulder

/**
 * DataProbeNode displays y-axis values at an x-axis position.  It can be dragged along the x axis.
 * The origin is at the top center of barNode.
 * Historical information and requirements can be found in https://github.com/phetsims/natural-selection/issues/14.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const DataProbeDragListener = require( 'NATURAL_SELECTION/common/view/population/DataProbeDragListener' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const NaturalSelectionUtils = require( 'NATURAL_SELECTION/common/NaturalSelectionUtils' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PopulationModel = require( 'NATURAL_SELECTION/common/model/PopulationModel' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );
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
  const MANIPULATOR_RADIUS = 5;

  class DataProbeNode extends Node {

    /**
     * @param {PopulationModel} populationModel
     * @param {number} originX TODO make this go away
     * @param {number} graphWidth
     * @param {number} graphHeight
     * @param {Object} [options]
     */
    constructor( populationModel, originX, graphWidth, graphHeight, options ) {

      assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );

      options = merge( {
        cursor: 'ew-resize', // east-west arrows, <->

        // phet-io
        tandem: Tandem.REQUIRED,
        phetioComponentOptions: {

          // model controls visibility
          visibleProperty: {
            phetioReadOnly: true,
            phetioDocumentation: 'visibility is controlled by the model'
          }
        }
      }, options );

      const dataProbe = populationModel.dataProbe;

      // Which side of the bar the displays are on: true = right, false = left
      let displaysOnRight = true;

      // Vertical bar
      const barNode = new Rectangle( 0, 0, 3, graphHeight, {
        fill: BAR_COLOR,
        opacity: 0.6,
        centerX: 0,
        y: 0
      } );
      barNode.mouseArea = barNode.localBounds.dilatedXY( 5, 0 );
      barNode.touchArea = barNode.localBounds.dilatedXY( 10, 0 );

      // Manipulator at bottom of bar
      const manipulator = new ShadedSphereNode( 2 * MANIPULATOR_RADIUS, {
        mouseArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
        touchArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
        centerX: barNode.centerX,
        centerY: barNode.bottom
      } );

      // NumberDisplay instances
      const totalDisplay = createSolidNumberDisplay( dataProbe.totalPopulationProperty, NaturalSelectionColors.TOTAL_POPULATION );
      const whiteFurDisplay = createSolidNumberDisplay( dataProbe.whiteFurPopulationProperty, NaturalSelectionColors.FUR );
      const brownFurDisplay = createDashedNumberDisplay( dataProbe.brownFurPopulationProperty, NaturalSelectionColors.FUR );
      const straightEarsDisplay = createSolidNumberDisplay( dataProbe.straightEarsPopulationProperty, NaturalSelectionColors.EARS );
      const floppyEarsDisplay = createDashedNumberDisplay( dataProbe.floppyEarsPopulationProperty, NaturalSelectionColors.EARS );
      const shortTeethDisplay = createSolidNumberDisplay( dataProbe.shortTeethPopulationProperty, NaturalSelectionColors.TEETH );
      const longTeethDisplay = createDashedNumberDisplay( dataProbe.longTeethPopulationProperty, NaturalSelectionColors.TEETH );

      // vertical layout of NumberDisplays 
      const numberDisplaysParent = new VBox( {
        spacing: 3,
        align: 'left'
        // children are set in multilink below
      } );

      assert && assert( !options.children, 'DataProbeNode sets children' );
      options.children = [ barNode, manipulator, numberDisplaysParent ];

      super( options );

      //TODO derive from dataProbe.generationProperty or make this go away
      // @private position in view coordinate frame, relative to the left edge of the graph
      this.positionProperty = new Property( new Vector2( originX, 0 ) );

      // x range in view coordinates
      const xRangeView = new Range( originX, originX + graphWidth );

      this.addInputListener( new DataProbeDragListener( this.positionProperty, xRangeView, {
        pressCursor: options.cursor,
        tandem: options.tandem.createTandem( 'dragListener' )
      } ) );

      // visibility of the probe
      dataProbe.visibleProperty.link( dataProbeVisible => {
        this.interruptSubtreeInput(); // cancel interactions
        this.visible = dataProbeVisible;
      } );

      // Positions the displays on the proper side of the bar.
      const updateDisplayLayout = () => {
        if ( displaysOnRight ) {
          numberDisplaysParent.left = barNode.right;
        }
        else {
          numberDisplaysParent.right = barNode.left;
        }
        numberDisplaysParent.top = barNode.top;
      };

      this.positionProperty.link( position => {
        this.x = position.x;

        //TODO update display values

        // flip NumberDisplays around y axis at edges of graph
        if ( this.left < xRangeView.min && !displaysOnRight ) {
          displaysOnRight = true;
          updateDisplayLayout();
        }
        else if ( this.right > xRangeView.max && displaysOnRight ) {
          displaysOnRight = false;
          updateDisplayLayout();
        }
      } );

      // To add a bit of space above the top NumberDisplay, and so that  always has at least 1 child
      // (and thus valid bounds) for layout.
      const vStrut = new VStrut( 5 );

      // When visibility of some quantity changes, change which NumberDisplays are children of numberDisplaysParent.
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
          numberDisplaysParent.children = children;
          updateDisplayLayout();
        } );

      // Create a link to the model that this Node displays
      this.addLinkedElement( populationModel.dataProbe, {
        tandem: options.tandem.createTandem( 'dataProbe' )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.positionProperty.reset();
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'DataProbeNode does not support dispose' );
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

  return naturalSelection.register( 'DataProbeNode', DataProbeNode );
} );