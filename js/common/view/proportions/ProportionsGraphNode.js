// Copyright 2019-2022, University of Colorado Boulder

/**
 * ProportionGraphNode displays the Proportions graph.
 * Note that this graph is not a performance concern, so it is currently updated regardless of whether it's visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, HBox, Node, Rectangle, Text, VBox } from '../../../../../scenery/js/imports.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import Gene from '../../model/Gene.js';
import GenePool from '../../model/GenePool.js';
import ProportionsModel from '../../model/ProportionsModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';
import ProportionsBarNode from './ProportionsBarNode.js';
import ProportionsGenerationSpinner from './ProportionsGenerationSpinner.js';

// constants
const ROW_SPACING = 30;
const COLUMN_SPACING = 20;
const ROW_LABEL_FONT = new PhetFont( 14 );
const COLUMN_LABEL_FONT = new PhetFont( 14 );
const ROW_LABELS_X_ALIGN = 'left';
const COLUMN_LABELS_X_ALIGN = 'center';
const CELLS_Y_ALIGN = 'bottom';

class ProportionsGraphNode extends Node {

  /**
   * @param {ProportionsModel} proportionsModel
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( proportionsModel, genePool, options ) {

    assert && assert( proportionsModel instanceof ProportionsModel, 'invalid proportionsModel' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {
      graphWidth: 100,
      graphHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED,
      visiblePropertyOptions: { phetioReadOnly: true }
    }, options );

    // To make this code easier to read
    const startCounts = proportionsModel.startCountsProperty.value;
    const endCounts = proportionsModel.endCountsProperty.value;
    const valuesVisibleProperty = proportionsModel.valuesVisibleProperty;

    const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      fill: NaturalSelectionColors.PROPORTIONS_GRAPH_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    // 'Start of Generation...'
    const startRowLabel = new RowLabel( naturalSelectionStrings.startOfGenerationStringProperty, startCounts.totalCount );

    // 'End of Generation...' or 'Currently...'
    const endRowTopTextDerivedProperty = new DerivedProperty( [
        proportionsModel.isDisplayingCurrentGenerationProperty,
        naturalSelectionStrings.currentlyStringProperty,
        naturalSelectionStrings.endOfGenerationStringProperty
      ], ( isDisplayingCurrentGeneration, currentlyString, endOfGenerationString ) =>
        isDisplayingCurrentGeneration ? currentlyString : endOfGenerationString
    );
    const endRowLabel = new RowLabel( endRowTopTextDerivedProperty, endCounts.totalCount );

    // All column labels have the same effective width.
    const columnLabelsAlignGroup = new AlignGroup();

    // Consider the graph to be a 2D grid. All cells below the column labels will have the same effective size.
    const cellsAlignGroup = new AlignGroup();

    // Layout of the first column, which contains row labels
    const labelsColumn = new VBox( {
      spacing: ROW_SPACING,
      children: [

        // no label for top row (column headings)
        new AlignBox( new Text( '', { font: ROW_LABEL_FONT } ), {
          group: columnLabelsAlignGroup,
          xAlign: ROW_LABELS_X_ALIGN,
          yAlign: CELLS_Y_ALIGN
        } ),

        new AlignBox( startRowLabel, {
          group: cellsAlignGroup,
          xAlign: ROW_LABELS_X_ALIGN,
          yAlign: CELLS_Y_ALIGN
        } ),
        new AlignBox( endRowLabel, {
          group: cellsAlignGroup,
          xAlign: ROW_LABELS_X_ALIGN,
          yAlign: CELLS_Y_ALIGN
        } )
      ]
    } );

    // A column for each gene
    const furColumn = new Column( genePool.furGene,
      startCounts.whiteFurCount, startCounts.brownFurCount,
      endCounts.whiteFurCount, endCounts.brownFurCount,
      valuesVisibleProperty, proportionsModel.furVisibleProperty,
      columnLabelsAlignGroup, cellsAlignGroup, {
        tandem: options.tandem.createTandem( 'furColumn' )
      } );
    const earsColumn = new Column( genePool.earsGene,
      startCounts.straightEarsCount, startCounts.floppyEarsCount,
      endCounts.straightEarsCount, endCounts.floppyEarsCount,
      valuesVisibleProperty, proportionsModel.earsVisibleProperty,
      columnLabelsAlignGroup, cellsAlignGroup, {
        tandem: options.tandem.createTandem( 'earsColumn' )
      } );
    const teethColumn = new Column( genePool.teethGene,
      startCounts.shortTeethCount, startCounts.longTeethCount,
      endCounts.shortTeethCount, endCounts.longTeethCount,
      valuesVisibleProperty, proportionsModel.teethVisibleProperty,
      columnLabelsAlignGroup, cellsAlignGroup, {
        tandem: options.tandem.createTandem( 'teethColumn' )
      } );
    const geneColumns = [ furColumn, earsColumn, teethColumn ];

    // Layout the columns
    const hBox = new HBox( {
      spacing: COLUMN_SPACING,
      align: 'center',
      children: [ labelsColumn, ...geneColumns ]
    } );

    // Spinner for selecting which generation is displayed
    const generationSpinner = new ProportionsGenerationSpinner( proportionsModel.proportionsGenerationProperty, {
      tandem: options.tandem.createTandem( 'generationSpinner' )
    } );

    const content = new VBox( {
      align: 'center',
      spacing: 35,
      children: [ hBox, generationSpinner ]
    } );

    // 'No Data', visible when we have no data to display.
    const noDataText = new Text( naturalSelectionStrings.noDataStringProperty, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT,
      centerX: backgroundNode.centerX,
      centerY: backgroundNode.top + ( backgroundNode.height / 6 ),
      maxWidth: 0.5 * backgroundNode.width,
      tandem: options.tandem.createTandem( 'noDataText' ),
      phetioVisiblePropertyInstrumented: false
    } );

    assert && assert( !options.children, 'ProportionGraphNode sets children' );
    options.children = [ backgroundNode, noDataText, content ];

    super( options );

    // Center content on the background. Columns or generationSpinner may be hidden via PhET-iO. unlink is not necessary.
    content.localBoundsProperty.link( () => {
      content.center = backgroundNode.center;
    } );

    // If there is no data to display, hide the content and display 'No Data'. unlink is not necessary.
    proportionsModel.hasDataProperty.link( hasData => {
      content.visible = hasData;
      noDataText.visible = !hasData;
    } );

    // Update the displayed 'Start' counts. unlink is not necessary.
    proportionsModel.startCountsProperty.link( startCounts => {
      startRowLabel.countProperty.value = startCounts.totalCount;
      furColumn.setStartCounts( startCounts.whiteFurCount, startCounts.brownFurCount );
      earsColumn.setStartCounts( startCounts.straightEarsCount, startCounts.floppyEarsCount );
      teethColumn.setStartCounts( startCounts.shortTeethCount, startCounts.longTeethCount );
    } );

    // Update the displayed 'End' counts. unlink is not necessary.
    proportionsModel.endCountsProperty.link( endCounts => {
      endRowLabel.countProperty.value = endCounts.totalCount;
      furColumn.setEndCounts( endCounts.whiteFurCount, endCounts.brownFurCount );
      earsColumn.setEndCounts( endCounts.straightEarsCount, endCounts.floppyEarsCount );
      teethColumn.setEndCounts( endCounts.shortTeethCount, endCounts.longTeethCount );
    } );

    // @private {Column[]}
    this.geneColumns = geneColumns;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   * @param {Gene} gene
   * @param {boolean} visible
   * @public
   */
  setGeneVisible( gene, visible ) {
    assert && assert( gene instanceof Gene, 'invalid gene' );
    assert && assert( typeof visible === 'boolean', 'invalid visible' );

    const column = _.find( this.geneColumns, column => ( column.gene === gene ) );
    assert && assert( column, `column not found for ${gene.name} gene` );
    column.visible = visible;
  }
}

/**
 * RowLabel is the label for a row of the Proportions graph.
 * The label consists of 2 lines of text, with a dynamic count on the second line.
 */
class RowLabel extends VBox {

  /**
   *
   * @param {TReadOnlyProperty} topStringProperty - string for the top line of text
   * @param {number} count
   * @param {Object} [options]
   */
  constructor( topStringProperty, count, options ) {

    assert && assert( topStringProperty instanceof ReadOnlyProperty, 'invalid topStringProperty' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( count ), 'invalid count' );

    options = merge( {
      spacing: 2,
      align: 'left'
    }, options );

    const countProperty = new NumberProperty( count, {
      numberType: 'Integer'
      // PhET-iO instrumentation is not necessary.
    } );

    const textOptions = {
      font: ROW_LABEL_FONT,
      maxWidth: 120 // determined empirically
    };

    // The 2 lines of text are separate Text nodes so that we don't have to deal with 'bunny' (singular) versus
    // 'bunnies' (plural) in multiple translated strings.  The top text indicates which generation the data is
    // related to.
    const topText = new Text( topStringProperty, textOptions );

    // The bottom text shows the count of bunnies.
    const bottomTextDerivedStringProperty = new DerivedProperty( [
        countProperty,
        naturalSelectionStrings.oneBunnyStringProperty,
        naturalSelectionStrings.countBunniesStringProperty
      ], ( count, oneBunnyString, countBunniesString ) =>
        ( count === 1 ) ? oneBunnyString : StringUtils.fillIn( countBunniesString, { count: count } )
    );
    const bottomText = new Text( bottomTextDerivedStringProperty, textOptions );

    assert && assert( !options.children, 'RowLabel sets children' );
    options.children = [ topText, bottomText ];

    super( options );

    // @public
    this.countProperty = countProperty;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'RowLabel does not support dispose' );
    super.dispose();
  }
}

/**
 * Column is a column in the Proportions graph. It contains a heading and 2 bars.
 */
class Column extends VBox {

  /**
   * @param {Gene} gene
   * @param {number} startNormalCount
   * @param {number} startMutantCount
   * @param {number} endNormalCount
   * @param {number} endMutantCount
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Property.<boolean>} geneVisibleProperty
   * @param {AlignGroup} columnLabelsAlignGroup
   * @param {AlignGroup} barsAlignGroup
   * @param {Object} [options]
   */
  constructor( gene, startNormalCount, startMutantCount, endNormalCount, endMutantCount,
               valuesVisibleProperty, geneVisibleProperty, columnLabelsAlignGroup, barsAlignGroup, options ) {

    assert && assert( gene instanceof Gene, 'invalid gene' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( startNormalCount ), 'invalid startNormalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( startMutantCount ), 'invalid startMutantCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( endNormalCount ), 'invalid endNormalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( endMutantCount ), 'invalid endMutantCount' );
    assert && AssertUtils.assertPropertyOf( valuesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( geneVisibleProperty, 'boolean' );
    assert && assert( barsAlignGroup instanceof AlignGroup, 'invalid barsAlignGroup' );

    options = merge( {
      spacing: ROW_SPACING,
      align: 'center',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Checkbox to hide the column
    const labelNode = new Text( gene.nameProperty, {
      font: COLUMN_LABEL_FONT,
      maxWidth: 100 // determined empirically
    } );
    const checkbox = new Checkbox( geneVisibleProperty, labelNode, merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
      tandem: options.tandem.createTandem( 'checkbox' )
    } ) );

    // Pointer areas for the checkbox
    const xDilation = 8;
    const yDilation = 6;
    checkbox.mouseArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );
    checkbox.touchArea = checkbox.localBounds.dilatedXY( xDilation, yDilation );

    const startBarNode = new ProportionsBarNode( gene.color, startNormalCount, startMutantCount, valuesVisibleProperty, {
      tandem: options.tandem.createTandem( 'startBarNode' )
    } );

    const endBarNode = new ProportionsBarNode( gene.color, endNormalCount, endMutantCount, valuesVisibleProperty, {
      tandem: options.tandem.createTandem( 'endBarNode' )
    } );

    assert && assert( !options.children, 'Column sets children' );
    options.children = [
      new AlignBox( checkbox, {
        group: columnLabelsAlignGroup,
        xAlign: COLUMN_LABELS_X_ALIGN,
        yAlign: CELLS_Y_ALIGN
      } ),
      new AlignBox( startBarNode, {
        group: barsAlignGroup,
        xAlign: COLUMN_LABELS_X_ALIGN,
        yAlign: CELLS_Y_ALIGN
      } ),
      new AlignBox( endBarNode, {
        group: barsAlignGroup,
        xAlign: COLUMN_LABELS_X_ALIGN,
        yAlign: CELLS_Y_ALIGN
      } )
    ];

    super( options );

    // unlink is not necessary.
    geneVisibleProperty.link( geneVisible => {
      startBarNode.visible = endBarNode.visible = geneVisible;
    } );

    // @private
    this.gene = gene;
    this.startBarNode = startBarNode; // {ProportionsBarNode}
    this.endBarNode = endBarNode; // {ProportionsBarNode}
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'Column does not support dispose' );
    super.dispose();
  }

  /**
   * Sets the counts for the 'start' bar.
   * @param {number} normalCount
   * @param {number} mutantCount
   * @public
   */
  setStartCounts( normalCount, mutantCount ) {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( normalCount ), 'invalid normalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( mutantCount ), 'invalid mutantCount' );

    this.startBarNode.setCounts( normalCount, mutantCount );
  }

  /**
   * Sets the counts for the 'end' bar.
   * @param {number} normalCount
   * @param {number} mutantCount
   * @public
   */
  setEndCounts( normalCount, mutantCount ) {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( normalCount ), 'invalid normalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( mutantCount ), 'invalid mutantCount' );

    this.endBarNode.setCounts( normalCount, mutantCount );
  }
}

naturalSelection.register( 'ProportionsGraphNode', ProportionsGraphNode );
export default ProportionsGraphNode;