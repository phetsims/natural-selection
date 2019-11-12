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
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const currentString = require( 'string!NATURAL_SELECTION/current' );
  const generationNumberString = require( 'string!NATURAL_SELECTION/generationNumber' );
  const nEqualsValueString = require( 'string!NATURAL_SELECTION/nEqualsValue' );
  const startOfGenerationString = require( 'string!NATURAL_SELECTION/startOfGeneration' );

  // constants
  const X_MARGIN = 15;
  const ARROW_BUTTON_OPTIONS = {
    lineWidth: 0.5,
    arrowWidth: 8, // width of base
    arrowHeight: 10 // from tip to base
  };
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
      const startCountProperty = new NumberProperty( 0 );
      const currentCountProperty = new NumberProperty( 0 );

      const backgroundNode = new Rectangle( 0, 0, width, height, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE
      } );

      const generationControl = new GenerationControl( generationProperty, {
        centerX: backgroundNode.centerX,
        top: backgroundNode.top + 8
      } );

      const labelAlignGroup = new AlignGroup();

      const startRow = new ProportionGraphRow( startOfGenerationString, startCountProperty, labelAlignGroup );
      const currentRow = new ProportionGraphRow( currentString, currentCountProperty, labelAlignGroup );

      const rows = new VBox( {
        spacing: 20,
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

  class GenerationControl extends HBox {

    /**
     * @param {Property.<number>} generationProperty
     * @param {Object} [options]
     */
    constructor( generationProperty, options ) {

      options = merge( {
        spacing: 10
      }, options );

      const titleNode = new Text( StringUtils.fillIn( generationNumberString, { number: 0 } ), {
        font: NaturalSelectionConstants.TITLE_FONT
      } );

      const previous = () => generationProperty.value--;
      const previousButton = new ArrowButton( 'left', previous, ARROW_BUTTON_OPTIONS );

      const next = () => generationProperty.value++;
      const nextButton = new ArrowButton( 'right', next, ARROW_BUTTON_OPTIONS );

      assert && assert( !options.children, 'GenerationControl sets children' );
      options.children = [ previousButton, titleNode, nextButton ];

      super( options );

      generationProperty.link( generation => {
        previousButton.enabled = ( generation > 0 );
        titleNode.text = StringUtils.fillIn( generationNumberString, { number: generation } );
      } );
    }
  }

  class ProportionGraphRow extends HBox {

    /**
     * @param {string} labelString
     * @param {Property.<number>} countProperty
     * @param {AlignGroup} valueAlignGroup
     */
    constructor( labelString, countProperty, valueAlignGroup ) {

      const labelNode = new Text( labelString, {
        font: LABEL_FONT
      } );

      // N = {{value}}
      const valueNode = new Text( StringUtils.fillIn( nEqualsValueString, {
        value: 0
      } ), {
        font: VALUE_FONT
      } );

      const valueVBox = new VBox( {
        spacing: 2,
        align: 'left',
        children: [
          labelNode,
          valueNode
        ]
      } );
      const valueAlignBox = new AlignBox( valueVBox, {
        group: valueAlignGroup,
        xAlign: 'left'
      } );

      super( {
        spacing: 8,
        align: 'left',
        children: [ valueAlignBox ]
      } );
    }
  }

  return naturalSelection.register( 'ProportionGraphNode', ProportionGraphNode );
} );