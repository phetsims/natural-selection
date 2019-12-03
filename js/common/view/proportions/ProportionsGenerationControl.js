// Copyright 2019, University of Colorado Boulder

/**
 * ProportionsGenerationControl is used to choose the generation number displayed in the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const generationNumberString = require( 'string!NATURAL_SELECTION/generationNumber' );

  class ProportionsGenerationControl extends HBox {

    /**
     * @param {Property.<number>} generationProperty
     * @param {Object} [options]
     */
    constructor( generationProperty, options ) {

      options = merge( {
        spacing: 10
      }, options );

      // Previous button decrements the generation number
      const previous = () => generationProperty.value--;
      const previousButton = new ArrowButton( 'left', previous, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS );

      // Next button decrements the generation number
      const next = () => generationProperty.value++;
      const nextButton = new ArrowButton( 'right', next, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS );

      // Generation number display
      const generationText = new Text( StringUtils.fillIn( generationNumberString, {
        number: 99 // values greater than this will result in generationText being scaled down 
      } ), {
        font: NaturalSelectionConstants.PROPORTIONS_GENERATION_CONTROL_FONT,
        maxWidth: 150 // determined empirically
      } );

      // This bit of code allows us to scale generationText and keep it centered between the buttons. 
      // We initialized generationText with a big generation number, so that becomes its new maxWidth.
      // The strut is sized to this maxWidth, and will be used to keep the display centered.
      generationText.maxWidth = generationText.width;
      const hStrut = new HStrut( generationText.width );
      const displayNode = new Node( {
        children: [ hStrut, generationText ]
      } );

      assert && assert( !options.children, 'ProportionsGenerationControl sets children' );
      options.children = [ previousButton, displayNode, nextButton ];

      super( options );

      generationProperty.link( generation => {

        // Update the generation number and re-center it
        generationText.text = StringUtils.fillIn( generationNumberString, { number: generation } );
        generationText.centerX = hStrut.centerX;
        generationText.centerY = previousButton.centerY;

        // Enable buttons
        previousButton.enabled = ( generation > 0 );
        //TODO nextButton.enabled = ?
      } );
    }
  }

  return naturalSelection.register( 'ProportionsGenerationControl', ProportionsGenerationControl );
} );