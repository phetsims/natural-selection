// Copyright 2019, University of Colorado Boulder

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
  const currentlyString = require( 'string!NATURAL_SELECTION/currently' );
  const countBunniesString = require( 'string!NATURAL_SELECTION/countBunnies' );
  const oneBunnyString = require( 'string!NATURAL_SELECTION/oneBunny' );
  const startOfGenerationString = require( 'string!NATURAL_SELECTION/startOfGeneration' );

  // constants
  const X_MARGIN = 15;
  const LABEL_FONT = new PhetFont( 14 );
  const VALUE_FONT = new PhetFont( 14 );

  class ProportionGraphNode extends Node {

    /**
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     */
    constructor( width, height, options ) {

      // TODO temporary Properties
      const generationProperty = new NumberProperty( 0 );
      const startCountProperty = new NumberProperty( 1 );
      const currentCountProperty = new NumberProperty( 50 );

      const backgroundNode = new Rectangle( 0, 0, width, height, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE
      } );

      const generationControl = new ProportionGenerationControl( generationProperty, {
        centerX: backgroundNode.centerX,
        top: backgroundNode.top + 8
      } );

      const labelAlignGroup = new AlignGroup();

      const startRow = new ProportionGraphRow( startOfGenerationString, startCountProperty, labelAlignGroup );
      const currentRow = new ProportionGraphRow( currentlyString, currentCountProperty, labelAlignGroup );

      const rows = new VBox( {
        spacing: 50,
        align: 'left',
        children: [ startRow, currentRow ],
        left: backgroundNode.left + X_MARGIN,
        centerY: backgroundNode.centerY
      } );

      assert && assert( !options.children, 'ProportionGraphNode sets children' );
      options.children = [ backgroundNode, generationControl, rows ];

      super( options );

      // @private
      this.generationProperty = generationProperty;
    }

    /**
     * @public
     */
    reset() {
      this.generationProperty.reset();
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
     */
    constructor( labelString, countProperty, valueAlignGroup, ) {

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
      const valueAlignBox = new AlignBox( valueVBox, {
        group: valueAlignGroup,
        xAlign: 'left'
      } );

      //TODO temporary Properties
      const furBarNode = new ProportionBarNode( NaturalSelectionColors.FUR, new NumberProperty( 70 ), new NumberProperty( 30 ) );
      const earsBarNode = new ProportionBarNode( NaturalSelectionColors.EARS, new NumberProperty( 40 ), new NumberProperty( 60 ) );
      const teethBarNode = new ProportionBarNode( NaturalSelectionColors.TEETH, new NumberProperty( 100 ), new NumberProperty( 0 ) );

      super( {
        spacing: 20,
        align: 'left',
        children: [ valueAlignBox, furBarNode, earsBarNode, teethBarNode ]
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