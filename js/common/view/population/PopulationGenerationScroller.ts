// Copyright 2019-2025, University of Colorado Boulder

/**
 * PopulationGenerationScroller scrolls the x-axis (Generation) of the Population graph.
 *
 * Note that this looks and behaves a bit like a spinner. But NumberSpinner cannot be used because it must
 * show a value. And this control is modifying a {Property.<Range>}, not a {Property.<number>}, and I didn't
 * want to deal with an adapter Property. So think of this as a set of 'forward' and 'back' buttons for scrolling
 * the x-axis range.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import Property from '../../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import HBox, { HBoxOptions } from '../../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Font from '../../../../../scenery/js/util/Font.js';
import ArrowButton, { ArrowButtonOptions } from '../../../../../sun/js/buttons/ArrowButton.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

type SelfOptions = {
  step?: number; // amount to step the range
  font?: Font;
};

type PopulationGenerationScrollerOptions = SelfOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class PopulationGenerationScroller extends HBox {

  /**
   * @param rangeProperty
   * @param maxProperty - maximum value for rangeProperty.value.max
   * @param isPlayingProperty
   * @param [providedOptions]
   */
  public constructor( rangeProperty: Property<Range>, maxProperty: TReadOnlyProperty<number>,
                      isPlayingProperty: Property<boolean>, providedOptions: PopulationGenerationScrollerOptions ) {

    const options = optionize<PopulationGenerationScrollerOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      step: 1,
      font: NaturalSelectionConstants.POPULATION_AXIS_FONT,

      // HBoxOptions
      spacing: 10,
      phetioVisiblePropertyInstrumented: false,
      isDisposable: false
    }, providedOptions );

    // Maintain the initial range length
    const rangeLength = rangeProperty.value.getLength();

    // label
    const labelNode = new Text( NaturalSelectionStrings.generationStringProperty, {
      font: options.font,
      maxWidth: 250 // determined empirically
    } );

    // back button
    const back = () => {
      isPlayingProperty.value = false; // pause the sim when we scroll back
      const max = Math.ceil( rangeProperty.value.max - options.step ); // snap to integer value
      const min = max - rangeLength;
      rangeProperty.value = new Range( min, max );
    };
    const backButton = new ArrowButton( 'left', back,
      combineOptions<ArrowButtonOptions>( {
        tandem: options.tandem.createTandem( 'backButton' ),
        enabledPropertyOptions: {
          phetioReadOnly: true, // see https://github.com/phetsims/natural-selection/issues/344
          phetioFeatured: false // see https://github.com/phetsims/natural-selection/issues/345
        }
      }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
    );

    // forward button
    const forward = () => {
      const max = Math.min( maxProperty.value, Math.floor( rangeProperty.value.max + options.step ) );
      const min = max - rangeLength;
      rangeProperty.value = new Range( min, max );
    };
    const forwardButton = new ArrowButton( 'right', forward,
      combineOptions<ArrowButtonOptions>( {
        tandem: options.tandem.createTandem( 'forwardButton' ),
        enabledPropertyOptions: {
          phetioReadOnly: true, // see https://github.com/phetsims/natural-selection/issues/344
          phetioFeatured: false // see https://github.com/phetsims/natural-selection/issues/345
        }
      }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
    );

    options.children = [ backButton, labelNode, forwardButton ];

    super( options );

    // Enable buttons. unmultilink is not necessary.
    Multilink.multilink(
      [ rangeProperty, maxProperty ],
      ( range, max ) => {
        backButton.enabled = ( range.min > 0 );
        forwardButton.enabled = ( range.max < max );
      } );
  }
}

naturalSelection.register( 'PopulationGenerationScroller', PopulationGenerationScroller );