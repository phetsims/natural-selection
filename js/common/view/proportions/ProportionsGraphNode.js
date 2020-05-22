// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionGraphNode displays the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import AlignBox from '../../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
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
import PopulationGenerationSpinner from './ProportionsGenerationSpinner.js';

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
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    }, options );

    // To make this code easier to read
    const startCounts = proportionsModel.startCounts;
    const endCounts = proportionsModel.endCounts;
    const valuesVisibleProperty = proportionsModel.valuesVisibleProperty;

    const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
      fill: NaturalSelectionColors.PROPORTIONS_GRAPH_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    // 'Start of Generation...'
    const startRowLabel = new RowLabel( naturalSelectionStrings.startOfGeneration, startCounts.totalCountProperty );

    // 'End of Generation...' or 'Currently...'
    const endRowLabel = new RowLabel( naturalSelectionStrings.endOfGeneration, endCounts.totalCountProperty );

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
          alignGroup: columnLabelsAlignGroup,
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

    // Columns that contain bars
    const furColumn = new Column( genePool.furGene,
      startCounts.whiteFurCountProperty, startCounts.brownFurCountProperty,
      endCounts.whiteFurCountProperty, endCounts.brownFurCountProperty,
      valuesVisibleProperty, columnLabelsAlignGroup, cellsAlignGroup, {
        tandem: options.tandem.createTandem( 'furColumn' )
      } );
    const earsColumn = new Column( genePool.earsGene,
      startCounts.straightEarsCountProperty, startCounts.floppyEarsCountProperty,
      endCounts.straightEarsCountProperty, endCounts.floppyEarsCountProperty,
      valuesVisibleProperty, columnLabelsAlignGroup, cellsAlignGroup, {
        tandem: options.tandem.createTandem( 'earsColumn' )
      } );
    const teethColumn = new Column( genePool.teethGene,
      startCounts.shortTeethCountProperty, startCounts.longTeethCountProperty,
      endCounts.shortTeethCountProperty, endCounts.longTeethCountProperty,
      valuesVisibleProperty, columnLabelsAlignGroup, cellsAlignGroup, {
        tandem: options.tandem.createTandem( 'teethColumn' )
      } );

    // Layout the columns
    const columns = new HBox( {
      spacing: COLUMN_SPACING,
      align: 'center',
      children: [ labelsColumn, furColumn, earsColumn, teethColumn ]
    } );

    // Spinner for selecting which generation is displayed
    const generationSpinner = new PopulationGenerationSpinner( proportionsModel.generationProperty, {
      tandem: options.tandem.createTandem( 'generationSpinner' )
    } );

    const content = new VBox( {
      align: 'center',
      spacing: 35,
      children: [ columns, generationSpinner ]
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

    // Center on the background. Columns may be removed via PhET-iO, so observe bounds.
    content.boundsProperty.link( () => {
      content.center = backgroundNode.center;
    } );

    // Change the label for the bottom row, depending on whether it's displaying the current generation or the
    // end state of a previous generation.
    proportionsModel.isDisplayingCurrentGenerationProperty.link( isDisplayingCurrentGeneration => {
      if ( isDisplayingCurrentGeneration ) {
        endRowLabel.setTopText( naturalSelectionStrings.currently );
      }
      else {
        endRowLabel.setTopText( naturalSelectionStrings.endOfGeneration );
      }
    } );

    // If there is no data to display, hide the content and display 'No Data'.
    proportionsModel.startCounts.totalCountProperty.link( totalCount => {
      noDataText.visible = ( totalCount === 0 );
      content.visible = !noDataText.visible;
    } );

    // @public for configuring ScreenViews only
    this.furColumn = furColumn;
    this.earsColumn = earsColumn;
    this.teethColumn = teethColumn;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ProportionsGraphNode does not support dispose' );
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
   * @param {Property.<number>} countProperty
   * @param {Object} [options]
   */
  constructor( topString, countProperty, options ) {

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

    // Update the count on the bottom line, and handle singular (1 bunny) vs plural (10 bunnies)
    countProperty.link( count => {
      if ( count === 1 ) {
        bottomText.text = naturalSelectionStrings.oneBunny;
      }
      else {
        bottomText.text = StringUtils.fillIn( naturalSelectionStrings.countBunnies, { count: count } );
      }
    } );

    // @private
    this.topText = topText;
  }

  /**
   * Sets the top line of text.
   * @param {string} topString
   * @public
   */
  setTopText( topString ) {
    this.topText.text = topString;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'RowLabel does not support dispose' );
  }
}

/**
 * Column is a column in the Proportions graph. It contains a heading and 2 bars.
 */
class Column extends VBox {

  /**
   * @param {Gene} gene
   * @param {Property.<number>} startNormalCountProperty
   * @param {Property.<number>} startMutantCountProperty
   * @param {Property.<number>} endNormalCountProperty
   * @param {Property.<number>} endMutantCountProperty
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {AlignGroup} columnLabelsAlignGroup
   * @param {AlignGroup} barsAlignGroup
   * @param {Object} [options]
   */
  constructor( gene, startNormalCountProperty, startMutantCountProperty, endNormalCountProperty, endMutantCountProperty,
               valuesVisibleProperty, columnLabelsAlignGroup, barsAlignGroup, options ) {

    assert && assert( gene instanceof Gene, 'invalid gene' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( startNormalCountProperty, 'number' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( startNormalCountProperty, 'number' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( endNormalCountProperty, 'number' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( endMutantCountProperty, 'number' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( valuesVisibleProperty, 'boolean' );
    assert && assert( barsAlignGroup instanceof AlignGroup, 'invalid barsAlignGroup' );

    options = merge( {
      spacing: ROW_SPACING,
      align: 'center',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const labelNode = new Text( gene.name, {
      font: COLUMN_LABEL_FONT,
      maxWidth: 120 // determined empirically
    } );

    const startBarNode = new ProportionsBarNode( gene.color, startNormalCountProperty, startMutantCountProperty, valuesVisibleProperty, {
      tandem: options.tandem.createTandem( 'startBarNode' )
    } );
    const endBarNode = new ProportionsBarNode( gene.color, endNormalCountProperty, endMutantCountProperty, valuesVisibleProperty, {
      tandem: options.tandem.createTandem( 'endBarNode' )
    } );

    assert && assert( !options.children, 'Column sets children' );
    options.children = [
      new AlignBox( labelNode, {
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
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'Column does not support dispose' );
  }
}

naturalSelection.register( 'ProportionsGraphNode', ProportionsGraphNode );
export default ProportionsGraphNode;