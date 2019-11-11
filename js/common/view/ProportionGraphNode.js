// Copyright 2019, University of Colorado Boulder

/**
 * ProportionGraphNode displays the proportion graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const generationNumberString = require( 'string!NATURAL_SELECTION/generationNumber' );

  // constants
  const ARROW_BUTTON_OPTIONS = {
    lineWidth: 0.5,
    arrowWidth: 8, // width of base
    arrowHeight: 10 // from tip to base
  };

  class ProportionGraphNode extends Node {

    /**
     * @param {number} width
     * @param {number} height
     * @param {Object} [options]
     */
    constructor( width, height, options ) {

      // the generation displayed by this Node
      const generationProperty = new NumberProperty( 0, {
        numberType: 'Integer'
      } );

      //TODO placeholder
      const rectangle = new Rectangle( 0, 0, width, height, {
        fill: 'white',
        stroke: NaturalSelectionColors.GRAPHS_STROKE
      } );

      const titleNode = new Text( StringUtils.fillIn( generationNumberString, { number: 0 } ), {
        font: NaturalSelectionConstants.TITLE_FONT
      } );

      const previous = () => this.generationProperty.value--;
      const previousButton = new ArrowButton( 'left', previous, ARROW_BUTTON_OPTIONS );

      const next = () => this.generationProperty.value++;
      const nextButton = new ArrowButton( 'right', next, ARROW_BUTTON_OPTIONS );

      const titleBox = new HBox( {
        spacing: 10,
        children: [ previousButton, titleNode, nextButton ]
      } );

      assert && assert( !options.children, 'ProportionGraphNode sets children' );
      options.children = [ rectangle, titleBox ];

      super( options );
      
      generationProperty.link( generation => {
        previousButton.enabled = ( generation > 0 );
        titleNode.text = StringUtils.fillIn( generationNumberString, { number: generation } );
        titleBox.centerX = rectangle.centerX;
        titleBox.top = rectangle.top + 8;
      } );

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

  return naturalSelection.register( 'ProportionGraphNode', ProportionGraphNode );
} );