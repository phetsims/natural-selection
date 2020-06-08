// Copyright 2019-2020, University of Colorado Boulder

/**
 * DataProbeNode displays y-axis values at an x-axis position.  It can be dragged along the x axis.
 * The origin is at the top center of barNode.
 * Historical information and requirements can be found in https://github.com/phetsims/natural-selection/issues/14.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Property from '../../../../../axon/js/Property.js';
import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import NumberDisplay from '../../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../../../scenery-phet/js/ShadedSphereNode.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import VStrut from '../../../../../scenery/js/nodes/VStrut.js';
import Color from '../../../../../scenery/js/util/Color.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';
import DataProbeDragListener from './DataProbeDragListener.js';

// constants
const BAR_COLOR = 'rgb( 120, 120, 120 )';
const MANIPULATOR_RADIUS = 5;
const NUMBER_DISPLAY_RANGE = new Range( 0, 10 * NaturalSelectionConstants.MAX_POPULATION );
const NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY = 0.7;
const NUMBER_DISPLAY_DEFAULTS = {
  textOptions: {
    font: new PhetFont( 12 )
  },
  backgroundFill: 'white',
  backgroundStroke: 'black',
  backgroundLineDash: [],
  backgroundLineWidth: 2,
  noValueString: MathSymbols.NO_VALUE,
  noValueAlign: 'center'
};

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
    assert && assert( typeof originX === 'number', 'invalid originX' );
    assert && assert( typeof graphWidth === 'number', 'invalid graphWidth' );
    assert && assert( typeof graphHeight === 'number', 'invalid graphHeight' );

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
    //TODO get color from Gene
    const totalDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'totalCount', NaturalSelectionColors.TOTAL_POPULATION );
    const whiteFurDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'whiteFurCount', NaturalSelectionColors.FUR );
    const brownFurDisplay = createDashedNumberDisplay( dataProbe.countsProperty, 'brownFurCount', NaturalSelectionColors.FUR );
    const straightEarsDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'straightEarsCount', NaturalSelectionColors.EARS );
    const floppyEarsDisplay = createDashedNumberDisplay( dataProbe.countsProperty, 'floppyEarsCount', NaturalSelectionColors.EARS );
    const shortTeethDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'shortTeethCount', NaturalSelectionColors.TEETH );
    const longTeethDisplay = createDashedNumberDisplay( dataProbe.countsProperty, 'longTeethCount', NaturalSelectionColors.TEETH );

    // vertical layout of NumberDisplays 
    const numberDisplaysParent = new VBox( {
      spacing: 3,
      align: 'left'
      // children are set in multilink below
    } );

    assert && assert( !options.children, 'DataProbeNode sets children' );
    options.children = [ barNode, manipulator, numberDisplaysParent ];

    super( options );

    // @private position in view coordinate frame, relative to the left edge of the graph
    //TODO derive from dataProbe.generationProperty or make this go away
    this.positionProperty = new Property( new Vector2( originX, 0 ) );

    // x range in view coordinates
    const xRangeView = new Range( originX, originX + graphWidth );

    this.addInputListener( new DataProbeDragListener( this.positionProperty, xRangeView, {
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

      //TODO update dataProbe.generationProperty, or do so in DataProbeDragListener

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
 * Creates a NumberDisplay whose background is filled with a solid color.  This is used for normal allele counts.
 * @param {Property.<BunnyCounts>} bunnyCountsProperty
 * @param {string} bunnyCountsFieldName - name of the desired field in BunnyCounts
 * @param {Color|string} color
 * @returns {NumberDisplay}
 */
function createSolidNumberDisplay( bunnyCountsProperty, bunnyCountsFieldName, color ) {
  const colorWithAlpha = Color.toColor( color ).withAlpha( NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY );
  return createNumberDisplay( bunnyCountsProperty, bunnyCountsFieldName, {
    backgroundFill: colorWithAlpha,
    backgroundStroke: colorWithAlpha
  } );
}

/**
 * Creates a NumberDisplay whose background is stroked with a dashed line. This is used for mutant allele counts.
 * @param {Property.<BunnyCounts>} bunnyCountsProperty
 * @param {string} bunnyCountsFieldName - name of the desired field in BunnyCounts
 * @param {Color|string} color
 * @returns {NumberDisplay}
 */
function createDashedNumberDisplay( bunnyCountsProperty, bunnyCountsFieldName, color ) {
  return createNumberDisplay( bunnyCountsProperty, bunnyCountsFieldName, {
    backgroundFill: new Color( 255, 255, 255, NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY ),
    backgroundStroke: color,
    backgroundLineDash: [ 3, 3 ]
  } );
}

/**
 * Creates a NumberDisplay for the data probe.
 * @param {Property.<BunnyCounts>} bunnyCountsProperty
 * @param {string} bunnyCountsFieldName - name of the desired field in BunnyCounts
 * @param {Object} [options]
 * @returns {NumberDisplay}
 */
function createNumberDisplay( bunnyCountsProperty, bunnyCountsFieldName, options ) {

  options = merge( {
    backgroundFill: 'white'
  }, NUMBER_DISPLAY_DEFAULTS, options );

  // Set the text fill based on whether the background color is dark or light.
  if ( !options.textOptions || options.textOptions.fill === undefined ) {
    options.textOptions = options.textOptions || {};
    options.textOptions.fill = NaturalSelectionUtils.isDarkColor( options.backgroundFill ) ? 'white' : 'black';
  }

  // Adapter Property, for interfacing with NumberDisplay
  const countProperty = new DerivedProperty( [ bunnyCountsProperty ],
    bunnyCounts => bunnyCounts ? bunnyCounts[ bunnyCountsFieldName ] : null
  );

  return new NumberDisplay( countProperty, NUMBER_DISPLAY_RANGE, options );
}

naturalSelection.register( 'DataProbeNode', DataProbeNode );
export default DataProbeNode;