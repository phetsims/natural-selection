// Copyright 2019, University of Colorado Boulder

//TODO change "Currently" to "End of Generation" after selection agents have been applied
/**
 * ProportionGraphNode displays the proportion graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ProportionBarNode = require( 'NATURAL_SELECTION/common/view/ProportionBarNode' );
  const ProportionGenerationControl = require( 'NATURAL_SELECTION/common/view/ProportionGenerationControl' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const countBunniesString = require( 'string!NATURAL_SELECTION/countBunnies' );
  const earsString = require( 'string!NATURAL_SELECTION/ears' );
  const endOfGenerationString = require( 'string!NATURAL_SELECTION/endOfGeneration' );
  const furString = require( 'string!NATURAL_SELECTION/fur' );
  const oneBunnyString = require( 'string!NATURAL_SELECTION/oneBunny' );
  const startOfGenerationString = require( 'string!NATURAL_SELECTION/startOfGeneration' );
  const teethString = require( 'string!NATURAL_SELECTION/teeth' );

  // constants
  const COLUMNS_SPACING = 20;
  const LABEL_FONT = new PhetFont( 14 );
  const VALUE_FONT = new PhetFont( 14 );

  class ProportionGraphNode extends Node {

    /**
     * @param {ProportionModel} proportionModel
     * @param {Object} [options]
     */
    constructor( proportionModel, options ) {

      options = merge( {
        graphWidth: 100,
        graphHeight: 100
      }, options );

      const backgroundNode = new Rectangle( 0, 0, options.graphWidth, options.graphHeight, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE
      } );

      const generationControl = new ProportionGenerationControl( proportionModel.generationProperty, {
        top: backgroundNode.top + 8
      } );
      generationControl.on( 'bounds', () => {
        generationControl.centerX = backgroundNode.centerX;
      } );

      const labelColumnAlignGroup = new AlignGroup();
      const barColumnsAlignGroup = new AlignGroup( { matchVertical: false } );

      // Column labels
      const columnLabelOptions = { font: LABEL_FONT };
      const columnLabels = new HBox( {
        spacing: COLUMNS_SPACING,
        children: [
          new AlignBox( new Text( '', columnLabelOptions ), { group: barColumnsAlignGroup } ),
          new AlignBox( new Text( furString, columnLabelOptions ), { group: barColumnsAlignGroup } ),
          new AlignBox( new Text( earsString, columnLabelOptions ), { group: barColumnsAlignGroup } ),
          new AlignBox( new Text( teethString, columnLabelOptions ), { group: barColumnsAlignGroup } )
        ]
      } );

      // Rows
      const startRow = new ProportionGraphRow( startOfGenerationString, proportionModel.startCountProperty,
        labelColumnAlignGroup, barColumnsAlignGroup );
      const currentRow = new ProportionGraphRow( endOfGenerationString, proportionModel.endCountProperty,
        labelColumnAlignGroup, barColumnsAlignGroup );
      const rows = new VBox( {
        spacing: 30,
        align: 'left',
        children: [ startRow, currentRow ]
      } );

      // Column labels above rows
      const graph = new VBox( {
        spacing: 20,
        align: 'left',
        children: [ columnLabels, rows ],
        centerX: backgroundNode.centerX,
        centerY: backgroundNode.centerY
      } );

      assert && assert( !options.children, 'ProportionGraphNode sets children' );
      options.children = [ backgroundNode, generationControl, graph ];

      super( options );
    }
  }

  /**
   * ProportionGraphRow is a row in the Proportion graph.
   */
  class ProportionGraphRow extends HBox {

    /**
     * @param {string} labelString
     * @param {Property.<number>} countProperty
     * @param {AlignGroup} valueAlignGroup
     * @param {AlignGroup} barColumnsAlignGroup
     */
    constructor( labelString, countProperty, valueAlignGroup, barColumnsAlignGroup ) {

      const labelNode = new Text( labelString, {
        font: LABEL_FONT
      } );

      // {{count}} bunnies
      const countNode = new Text( '', {
        font: VALUE_FONT
      } );

      const valueVBox = new VBox( {
        spacing: 2,
        align: 'left',
        children: [
          labelNode,
          countNode
        ]
      } );

      //TODO temporary Properties
      const furBarNode = new ProportionBarNode( NaturalSelectionColors.FUR, new NumberProperty( 70 ), new NumberProperty( 30 ) );
      const earsBarNode = new ProportionBarNode( NaturalSelectionColors.EARS, new NumberProperty( 40 ), new NumberProperty( 60 ) );
      const teethBarNode = new ProportionBarNode( NaturalSelectionColors.TEETH, new NumberProperty( 100 ), new NumberProperty( 0 ) );

      super( {
        spacing: COLUMNS_SPACING,
        align: 'bottom',
        children: [
          new AlignBox( valueVBox, { group: valueAlignGroup, xAlign: 'left' } ),
          new AlignBox( furBarNode, { group: barColumnsAlignGroup, xAlign: 'center' } ),
          new AlignBox( earsBarNode, { group: barColumnsAlignGroup, xAlign: 'center' } ),
          new AlignBox( teethBarNode, { group: barColumnsAlignGroup, xAlign: 'center' } )
        ]
      } );

      countProperty.link( count => {
        if ( count === 1 ) {
          countNode.text = oneBunnyString;
        }
        else {
          countNode.text = StringUtils.fillIn( countBunniesString, { count: count } );
        }
      } );
    }
  }

  return naturalSelection.register( 'ProportionGraphNode', ProportionGraphNode );
} );