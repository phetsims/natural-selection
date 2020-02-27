// Copyright 2019, University of Colorado Boulder

/**
 * ProportionsGenerationControl is used to choose the generation number displayed in the Proportions graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import Range from '../../../../../dot/js/Range.js';
import merge from '../../../../../phet-core/js/merge.js';
import NumberDisplay from '../../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import ArrowButton from '../../../../../sun/js/buttons/ArrowButton.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelectionStrings from '../../../natural-selection-strings.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

const generationValueString = naturalSelectionStrings.generationValue;

class ProportionsGenerationControl extends HBox {

  /**
   * @param {Property.<number>} visibileGenerationProperty
   * @param {Property.<number>} currentGenerationProperty
   * @param {Object} [options]
   */
  constructor( visibileGenerationProperty, currentGenerationProperty, options ) {

    options = merge( {
      spacing: 10,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Previous button, decrements the generation number
    const previousButton = new ArrowButton( 'left',
      () => visibileGenerationProperty.value--,
      merge( {
        tandem: options.tandem.createTandem( 'previousButton' )
      }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
    );

    // Next button, increments the generation number
    const nextButton = new ArrowButton( 'right',
      () => visibileGenerationProperty.value++,
      merge( {
        tandem: options.tandem.createTandem( 'nextButton' )
      }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
    );

    // Generation number display
    const generationDisplay = new NumberDisplay( visibileGenerationProperty, new Range( 0, 99 ), {
      align: 'center',
      valuePattern: generationValueString,
      font: NaturalSelectionConstants.PROPORTIONS_GENERATION_CONTROL_FONT,
      xMargin: 0,
      yMargin: 0,
      backgroundFill: null,
      backgroundStroke: null,
      maxWidth: 150 // determined empirically
    } );

    assert && assert( !options.children, 'ProportionsGenerationControl sets children' );
    options.children = [ previousButton, generationDisplay, nextButton ];

    super( options );

    // Enable buttons
    Property.multilink(
      [ visibileGenerationProperty, currentGenerationProperty ],
      ( visibileGeneration, currentGeneration ) => {
        previousButton.enabled = ( visibileGeneration > 0 );
        nextButton.enabled = ( visibileGeneration < currentGeneration );
      } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ProportionsGenerationControl does not support dispose' );
  }
}

naturalSelection.register( 'ProportionsGenerationControl', ProportionsGenerationControl );
export default ProportionsGenerationControl;