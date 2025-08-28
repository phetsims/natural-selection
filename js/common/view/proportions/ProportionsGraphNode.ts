// Copyright 2019-2025, University of Colorado Boulder

/**
 * ProportionGraphNode displays the Proportions graph.
 * Note that this graph is not a performance concern, so it is currently updated regardless of whether it's visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Property from '../../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import AlignGroup from '../../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../../sun/js/Checkbox.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import Gene from '../../model/Gene.js';
import GenePool from '../../model/GenePool.js';
import ProportionsModel from '../../model/ProportionsModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';
import ProportionsBarNode from './ProportionsBarNode.js';
import ProportionsGenerationSpinner from './ProportionsGenerationSpinner.js';

const ROW_SPACING = 30;
const COLUMN_SPACING = 20;
const ROW_LABEL_FONT = new PhetFont( 14 );
const COLUMN_LABEL_FONT = new PhetFont( 14 );
const ROW_LABELS_X_ALIGN = 'left';
const COLUMN_LABELS_X_ALIGN = 'center';
const CELLS_Y_ALIGN = 'bottom';

type SelfOptions = {
  graphWidth?: number;
  graphHeight?: number;
};

type ProportionsGraphNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ProportionsGraphNode extends Node {

  private readonly geneColumns: Column[];

  public constructor( proportionsModel: ProportionsModel, genePool: GenePool, providedOptions: ProportionsGraphNodeOptions ) {

    const options = optionize<ProportionsGraphNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      graphWidth: 100,
      graphHeight: 100,

      // NodeOptions
      phetioVisiblePropertyInstrumented: false,
      isDisposable: false
    }, providedOptions );

    // To make this code easier to read
    const startCounts = proportionsModel.startCountsProperty.value;
    const endCounts = proportionsModel.endCountsProperty.value;
    const valuesVisibleProperty = proportionsModel.valuesVisibleProperty;

    const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      fill: NaturalSelectionColors.PROPORTIONS_GRAPH_FILL,
      stroke: NaturalSelectionColors.PANEL_STROKE
    } );

    const columnsTandem = options.tandem.createTandem( 'columns' );
    const labelsColumnTandem = columnsTandem.createTandem( 'labelsColumn' );

    // 'Start of Generation...'
    const startRowLabel = new RowLabel( NaturalSelectionStrings.startOfGenerationStringProperty, startCounts.totalCount, {
      tandem: labelsColumnTandem.createTandem( 'startRowLabel' )
    } );

    // 'End of Generation...' or 'Currently...'
    const endRowLabelTandem = labelsColumnTandem.createTandem( 'endRowLabel' );
    const endRowTopTextDerivedProperty = new DerivedStringProperty( [
      proportionsModel.isDisplayingCurrentGenerationProperty,
      NaturalSelectionStrings.currentlyStringProperty,
      NaturalSelectionStrings.endOfGenerationStringProperty
    ], ( isDisplayingCurrentGeneration, currentlyString, endOfGenerationString ) =>
      isDisplayingCurrentGeneration ? currentlyString : endOfGenerationString, {
      tandem: endRowLabelTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME )
    } );
    const endRowLabel = new RowLabel( endRowTopTextDerivedProperty, endCounts.totalCount, {
      tandem: endRowLabelTandem
    } );

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
        tandem: columnsTandem.createTandem( 'furColumn' )
      } );
    const earsColumn = new Column( genePool.earsGene,
      startCounts.straightEarsCount, startCounts.floppyEarsCount,
      endCounts.straightEarsCount, endCounts.floppyEarsCount,
      valuesVisibleProperty, proportionsModel.earsVisibleProperty,
      columnLabelsAlignGroup, cellsAlignGroup, {
        tandem: columnsTandem.createTandem( 'earsColumn' )
      } );
    const teethColumn = new Column( genePool.teethGene,
      startCounts.shortTeethCount, startCounts.longTeethCount,
      endCounts.shortTeethCount, endCounts.longTeethCount,
      valuesVisibleProperty, proportionsModel.teethVisibleProperty,
      columnLabelsAlignGroup, cellsAlignGroup, {
        tandem: columnsTandem.createTandem( 'teethColumn' )
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
    const noDataText = new Text( NaturalSelectionStrings.noDataStringProperty, {
      font: NaturalSelectionConstants.INSTRUCTIONS_FONT,
      maxWidth: 0.5 * backgroundNode.width
    } );
    noDataText.boundsProperty.link( bounds => {
      noDataText.centerX = backgroundNode.centerX;
      noDataText.centerY = backgroundNode.top + ( backgroundNode.height / 6 );
    } );

    options.children = [ backgroundNode, noDataText, content ];

    super( options );

    // Center content on the background. Columns or generationSpinner may be hidden via PhET-iO. unlink is not necessary.
    content.boundsProperty.link( () => {
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

    this.geneColumns = geneColumns;
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {

    const column = _.find( this.geneColumns, column => ( column.gene === gene ) )!;
    assert && assert( column, `column not found for ${gene.nameProperty.value} gene` );
    column.visible = visible;
  }
}

/**
 * RowLabel is the label for a row of the Proportions graph.
 * The label consists of 2 lines of text, with a dynamic bunny count on the second line.
 */

type RowLabelSelfOptions = EmptySelfOptions;

type RowLabelOptions = RowLabelSelfOptions & PickRequired<VBoxOptions, 'tandem'>;

class RowLabel extends VBox {

  public readonly countProperty: Property<number>;

  /**
   * @param firstLineStringProperty - string for the first line of text
   * @param count
   * @param [providedOptions]
   */
  public constructor( firstLineStringProperty: TReadOnlyProperty<string>, count: number, providedOptions: RowLabelOptions ) {

    const options = optionize<RowLabelOptions, RowLabelSelfOptions, VBoxOptions>()( {

      // VBoxOptions
      spacing: 2,
      align: 'left',
      phetioVisiblePropertyInstrumented: false,
      isDisposable: false
    }, providedOptions );

    const countProperty = new NumberProperty( count, {
      numberType: 'Integer'
      // PhET-iO instrumentation is not necessary.
    } );

    const textOptions = {
      font: ROW_LABEL_FONT,
      maxWidth: 120 // determined empirically
    };

    // The 2 lines of text are separate Text nodes so that we don't have to deal with 'bunny' (singular) versus
    // 'bunnies' (plural) in multiple translated strings.

    // The first line of text indicates which generation the data is related to.
    const firstLineOfText = new Text( firstLineStringProperty, textOptions );

    // The second line of text shows the count of bunnies.
    const secondLineOfTextStringProperty = new DerivedStringProperty( [
        countProperty,
        NaturalSelectionStrings.oneBunnyStringProperty,
        NaturalSelectionStrings.countBunniesStringProperty
      ],
      ( count, oneBunnyString, countBunniesString ) =>
        ( count === 1 ) ? oneBunnyString : StringUtils.fillIn( countBunniesString, { count: count } )
    );
    const secondLineOfText = new Text( secondLineOfTextStringProperty, textOptions );

    options.children = [ firstLineOfText, secondLineOfText ];

    super( options );

    this.countProperty = countProperty;
  }
}

/**
 * Column is a column in the Proportions graph. It contains a heading and 2 bars.
 */

type ColumnSelfOptions = EmptySelfOptions;

type ColumnOptions = ColumnSelfOptions & PickRequired<VBoxOptions, 'tandem'>;

class Column extends VBox {

  public readonly gene: Gene;
  private readonly startBarNode: ProportionsBarNode;
  private readonly endBarNode: ProportionsBarNode;

  public constructor( gene: Gene,
                      startNormalCount: number, startMutantCount: number,
                      endNormalCount: number, endMutantCount: number,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      geneVisibleProperty: Property<boolean>,
                      columnLabelsAlignGroup: AlignGroup,
                      barsAlignGroup: AlignGroup,
                      providedOptions: ColumnOptions ) {

    const options = optionize<ColumnOptions, ColumnSelfOptions, VBoxOptions>()( {

      // VBoxOptions
      spacing: ROW_SPACING,
      align: 'center',
      visiblePropertyOptions: {
        phetioReadOnly: true
      },
      isDisposable: false
    }, providedOptions );

    // Checkbox to hide the column
    const checkboxTandem = options.tandem.createTandem( 'checkbox' );
    const text = new Text( gene.nameProperty, {
      font: COLUMN_LABEL_FONT,
      maxWidth: 100 // determined empirically
    } );
    const checkbox = new Checkbox( geneVisibleProperty, text,
      combineOptions<CheckboxOptions>( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
        tandem: checkboxTandem
      } ) );

    // Pointer areas for the checkbox
    const xDilation = 8;
    const yDilation = 6;
    checkbox.localBoundsProperty.link( localBounds => {
      checkbox.mouseArea = localBounds.dilatedXY( xDilation, yDilation );
      checkbox.touchArea = localBounds.dilatedXY( xDilation, yDilation );
    } );

    const startBarNode = new ProportionsBarNode( gene.color, startNormalCount, startMutantCount, valuesVisibleProperty, {
      tandem: options.tandem.createTandem( 'startBarNode' )
    } );

    const endBarNode = new ProportionsBarNode( gene.color, endNormalCount, endMutantCount, valuesVisibleProperty, {
      tandem: options.tandem.createTandem( 'endBarNode' )
    } );

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

    this.gene = gene;
    this.startBarNode = startBarNode;
    this.endBarNode = endBarNode;
  }

  /**
   * Sets the counts for the 'start' bar.
   */
  public setStartCounts( normalCount: number, mutantCount: number ): void {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( normalCount ), 'invalid normalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( mutantCount ), 'invalid mutantCount' );

    this.startBarNode.setCounts( normalCount, mutantCount );
  }

  /**
   * Sets the counts for the 'end' bar.
   */
  public setEndCounts( normalCount: number, mutantCount: number ): void {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( normalCount ), 'invalid normalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( mutantCount ), 'invalid mutantCount' );

    this.endBarNode.setCounts( normalCount, mutantCount );
  }
}

naturalSelection.register( 'ProportionsGraphNode', ProportionsGraphNode );