// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionGraphNode displays the Proportions graph.
 * Note that this graph is not a performance concern, so it is currently updated regardless of whether it's visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import AlignBox from '../../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
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
    const startRowLabel = new RowLabel( naturalSelectionStrings.startOfGeneration, startCounts.totalCount );

    // 'End of Generation...' or 'Currently...'
    const endRowLabel = new RowLabel( naturalSelectionStrings.endOfGeneration, endCounts.totalCount );

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
    const noDataText = new Text( naturalSelectionStrings.noData, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT,
      centerX: backgroundNode.centerX,
      centerY: backgroundNode.top + ( backgroundNode.height / 6 ),
      maxWidth: 0.5 * backgroundNode.width
    } );

    assert && assert( !options.children, 'ProportionGraphNode sets children' );
    options.children = [ backgroundNode, noDataText, content ];

    super( options );

    // Center content on the background. Columns or generationSpinner may be hidden via PhET-iO. unlink is not necessary.
    content.localBoundsProperty.link( () => {
      content.center = backgroundNode.center;
    } );

    // Change the label for the bottom row, depending on whether it's displaying the current generation or the
    // end state of a previous generation. unlink is not necessary.
    proportionsModel.isDisplayingCurrentGenerationProperty.link( isDisplayingCurrentGeneration => {
      if ( isDisplayingCurrentGeneration ) {
        endRowLabel.setTopText( naturalSelectionStrings.currently );
      }
      else {
        endRowLabel.setTopText( naturalSelectionStrings.endOfGeneration );
      }
    } );

    // If there is no data to display, hide the content and display 'No Data'. unlink is not necessary.
    proportionsModel.hasDataProperty.link( hasData => {
      content.visible = hasData;
      noDataText.visible = !hasData;
    } );

    // Update the displayed 'Start' counts. unlink is not necessary.
    proportionsModel.startCountsProperty.link( startCounts => {
      startRowLabel.setCount( startCounts.totalCount );
      furColumn.setStartCounts( startCounts.whiteFurCount, startCounts.brownFurCount );
      earsColumn.setStartCounts( startCounts.straightEarsCount, startCounts.floppyEarsCount );
      teethColumn.setStartCounts( startCounts.shortTeethCount, startCounts.longTeethCount );
    } );

    // Update the displayed 'End' counts. unlink is not necessary.
    proportionsModel.endCountsProperty.link( endCounts => {
      endRowLabel.setCount( endCounts.totalCount );
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
   * @param {string} topString - string for the top line of text
   * @param {number} count
   * @param {Object} [options]
   */
  constructor( topString, count, options ) {

    assert && assert( typeof topString === 'string', 'invalid topString' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( count ), 'invalid count' );

    options = merge( {
      spacing: 2,
      align: 'left'
    }, options );

    const textOptions = {
      font: ROW_LABEL_FONT,
      maxWidth: 120 // determined empirically
    };

    // The 2 lines of text are separate Text nodes so that we don't have to deal with 'bunny' (singular) versus
    // 'bunnies' (plural) in multiple translated strings.
    const topText = new Text( topString, textOptions );
    const bottomText = new Text( '', textOptions );

    assert && assert( !options.children, 'RowLabel sets children' );
    options.children = [ topText, bottomText ];

    super( options );

    // @private {Text}
    this.topText = topText;
    this.bottomText = bottomText;

    this.setCount( count );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'RowLabel does not support dispose' );
    super.dispose();
  }

  /**
   * Sets the top line of text.
   * @param {string} topString
   * @public
   */
  setTopText( topString ) {
    assert && assert( typeof topString === 'string', 'invalid topString' );
    this.topText.text = topString;
  }

  /**
   * Sets the count in the bottom line of text.
   * @param {number} count
   * @public
   */
  setCount( count ) {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( count ), 'invalid count' );

    if ( count === 1 ) {
      this.bottomText.text = naturalSelectionStrings.oneBunny;
    }
    else {
      this.bottomText.text = StringUtils.fillIn( naturalSelectionStrings.countBunnies, { count: count } );
    }
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
    const labelNode = new Text( gene.name, {
      font: COLUMN_LABEL_FONT,
      maxWidth: 100 // determined empirically
    } );
    const checkbox = new Checkbox( labelNode, geneVisibleProperty,
      merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
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