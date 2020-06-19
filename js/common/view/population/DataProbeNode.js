// Copyright 2019-2020, University of Colorado Boulder

/**
 * DataProbeNode displays population (y-axis) values for a specific generation (x-axis) value.
 * It can be dragged along the x axis. The origin is at the top center of barNode.
 * Historical information and requirements can be found in https://github.com/phetsims/natural-selection/issues/14.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Property from '../../../../../axon/js/Property.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Shape from '../../../../../kite/js/Shape.js';
import merge from '../../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay from '../../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../../../scenery-phet/js/ShadedSphereNode.js';
import DragListener from '../../../../../scenery/js/listeners/DragListener.js';
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

// constants
const MANIPULATOR_RADIUS = 5;
const NUMBER_DISPLAY_RANGE = new Range( 0, 10 * NaturalSelectionConstants.MAX_POPULATION );
const NUMBER_DISPLAY_BACKGROUND_FILL_OPACITY = 0.7;
const NUMBER_DISPLAY_DEFAULTS = {
  textOptions: {
    font: new PhetFont( 12 )
  },
  backgroundLineWidth: 2,
  noValueAlign: 'center'
};

class DataProbeNode extends Node {

  /**
   * @param {PopulationModel} populationModel
   * @param {Object} [options]
   */
  constructor( populationModel, options ) {

    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );

    options = merge( {
      cursor: 'ew-resize', // east-west arrows, <->
      gridWidth: 100, // dimensions of the grid (sans tick marks) in view coordinates
      gridHeight: 100,
      offset: Vector2.ZERO, // offset in view coordinates

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

    // Transform for data probe offset from the top-left of the grid
    const offsetTransform =
      ModelViewTransform2.createOffsetScaleMapping( options.offset, options.gridWidth / populationModel.xWidth );

    // Which side of the bar the displays are on: true = right, false = left
    let displaysOnRight = true;

    // Vertical bar
    const barNode = new Rectangle( 0, 0, 3, options.gridHeight, {
      fill: NaturalSelectionColors.DATA_PROBE_BAR_COLOR,
      opacity: 0.6,
      centerX: 0,
      y: 0
    } );
    barNode.mouseArea = barNode.localBounds.dilatedXY( 5, 0 );
    barNode.touchArea = barNode.localBounds.dilatedXY( 10, 0 );

    // Manipulator at bottom of the bar
    const manipulator = new ShadedSphereNode( 2 * MANIPULATOR_RADIUS, {
      mainColor: NaturalSelectionColors.DATA_PROBE_MANIPULATOR_COLOR,
      mouseArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
      touchArea: Shape.circle( 0, 0, 2 * MANIPULATOR_RADIUS ),
      centerX: barNode.centerX,
      centerY: barNode.bottom
    } );

    // NumberDisplay instances
    const genePool = populationModel.genePool;
    const totalDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'totalCount', NaturalSelectionColors.POPULATION_TOTAL_COUNT );
    const whiteFurDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'whiteFurCount', genePool.furGene.color );
    const brownFurDisplay = createDashedNumberDisplay( dataProbe.countsProperty, 'brownFurCount', genePool.furGene.color );
    const straightEarsDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'straightEarsCount', genePool.earsGene.color );
    const floppyEarsDisplay = createDashedNumberDisplay( dataProbe.countsProperty, 'floppyEarsCount', genePool.earsGene.color );
    const shortTeethDisplay = createSolidNumberDisplay( dataProbe.countsProperty, 'shortTeethCount', genePool.teethGene.color );
    const longTeethDisplay = createDashedNumberDisplay( dataProbe.countsProperty, 'longTeethCount', genePool.teethGene.color );

    // vertical layout of NumberDisplays 
    const numberDisplaysParent = new VBox( {
      spacing: 3,
      align: 'left',
      children: [
        new VStrut( 5 ), // a bit of space at the top
        totalDisplay,
        whiteFurDisplay, brownFurDisplay,
        straightEarsDisplay, floppyEarsDisplay,
        shortTeethDisplay, longTeethDisplay
      ]
    } );

    assert && assert( !options.children, 'DataProbeNode sets children' );
    options.children = [ barNode, manipulator, numberDisplaysParent ];

    super( options );

    this.addInputListener( new DragListener( {
      positionProperty: dataProbe.offsetProperty,
      transform: offsetTransform,
      dragBoundsProperty: new Property( new Bounds2( 0, 0, populationModel.xWidth, 0 ) ), // model coordinates
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // Visibility of the probe. unlink is not necessary.
    dataProbe.visibleProperty.link( dataProbeVisible => {
      this.interruptSubtreeInput(); // cancel interactions
      this.visible = dataProbeVisible;
    } );

    // Visibility of NumberDisplays. VBox handles compacting the layout.
    populationModel.totalVisibleProperty.linkAttribute( totalDisplay, 'visible' );
    populationModel.whiteFurVisibleProperty.linkAttribute( whiteFurDisplay, 'visible' );
    populationModel.brownFurVisibleProperty.linkAttribute( brownFurDisplay, 'visible' );
    populationModel.straightEarsVisibleProperty.linkAttribute( straightEarsDisplay, 'visible' );
    populationModel.floppyEarsVisibleProperty.linkAttribute( floppyEarsDisplay, 'visible' );
    populationModel.shortTeethVisibleProperty.linkAttribute( shortTeethDisplay, 'visible' );
    populationModel.longTeethVisibleProperty.linkAttribute( longTeethDisplay, 'visible' );

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

    // unlink is not necessary.
    dataProbe.offsetProperty.link( offset => {

      this.x = offsetTransform.modelToViewPosition( offset ).x;

      // flip NumberDisplays around y axis at edges of graph
      if ( this.left < options.offset.x && !displaysOnRight ) {
        displaysOnRight = true;
        updateDisplayLayout();
      }
      else if ( this.right > + options.offset.x + options.gridWidth && displaysOnRight ) {
        displaysOnRight = false;
        updateDisplayLayout();
      }
    } );

    // Create a link to the model that this Node displays
    this.addLinkedElement( dataProbe, {
      tandem: options.tandem.createTandem( 'dataProbe' )
    } );
  }

  /**
   * @public
   */
  reset() {
    //TODO delete?
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Creates a NumberDisplay whose background is filled with a solid color.  This is used for normal allele counts.
 * @param {Property.<BunnyCounts|null>} bunnyCountsProperty
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
 * @param {Property.<BunnyCounts|null>} bunnyCountsProperty
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
 * @param {Property.<BunnyCounts|null>} bunnyCountsProperty
 * @param {string} bunnyCountsFieldName - name of the desired field in BunnyCounts
 * @param {Object} [options] - NumberDisplay options
 * @returns {NumberDisplay}
 */
function createNumberDisplay( bunnyCountsProperty, bunnyCountsFieldName, options ) {

  assert && assert( bunnyCountsProperty instanceof Property, 'invalid bunnyCountsProperty' );
  assert && assert( typeof bunnyCountsFieldName === 'string', 'invalid bunnyCountsFieldName' );

  options = merge( {
    backgroundFill: 'white'
  }, NUMBER_DISPLAY_DEFAULTS, options );

  // Set the text fill based on whether the background color is dark or light.
  if ( !options.textOptions || options.textOptions.fill === undefined ) {
    options.textOptions = options.textOptions || {};
    options.textOptions.fill = Color.isDarkColor( options.backgroundFill ) ? 'white' : 'black';
  }

  // Adapter Property, for interfacing with NumberDisplay. dispose is not necessary.
  const countProperty = new DerivedProperty( [ bunnyCountsProperty ],
    bunnyCounts => bunnyCounts ? bunnyCounts[ bunnyCountsFieldName ] : null
  );

  return new NumberDisplay( countProperty, NUMBER_DISPLAY_RANGE, options );
}

naturalSelection.register( 'DataProbeNode', DataProbeNode );
export default DataProbeNode;