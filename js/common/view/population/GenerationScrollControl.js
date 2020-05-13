// Copyright 2019-2020, University of Colorado Boulder

/**
 * GenerationScrollControl is the control used for scrolling the x-axis (Generation) of the Population graph.
 *
 * Note that this looks and behaves a bit like a spinner. But NumberSpinner cannot be used because it must
 * show a value. And this control is modifying a {Property.<Range>}, not a {Property.<number>}. So think of
 * this as a set of 'forward' and 'back' buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import Range from '../../../../../dot/js/Range.js';
import merge from '../../../../../phet-core/js/merge.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import ArrowButton from '../../../../../sun/js/buttons/ArrowButton.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

class GenerationScrollControl extends HBox {

  /**
   * @param {Property.<Range>} rangeProperty
   * @param {Property.<number>} maxProperty - maximum value for rangeProperty.value.max
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Object} [options]
   */
  constructor( rangeProperty, maxProperty, isPlayingProperty, options ) {

    assert && assert( rangeProperty instanceof Property, 'invalid rangeProperty' );
    assert && assert( rangeProperty.value instanceof Range, 'invalid rangeProperty.value' );
    assert && assert( maxProperty instanceof Property, 'invalid maxProperty' );
    assert && assert( typeof maxProperty.value === 'number', 'invalid maxProperty.value' );
    assert && assert( isPlayingProperty instanceof Property, 'invalid isPlayingProperty' );
    assert && assert( typeof isPlayingProperty.value === 'boolean', 'invalid isPlayingProperty.value' );

    options = merge( {

      step: 1, // {number} amount to step the range
      labelString: '', // {string} label that appears between the arrow buttons
      font: NaturalSelectionConstants.POPULATION_AXIS_FONT,

      // HBox options
      spacing: 10,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Maintain the initial range length
    const rangeLength = rangeProperty.value.getLength();

    // label
    const labelNode = new Text( options.labelString, {
      font: options.font,
      maxWidth: 250, // determined empirically
      tandem: options.tandem.createTandem( 'labelNode' ),
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    } );

    // back button
    const back = () => {
      isPlayingProperty.value = false; // pause the sim when we scroll back
      const max = Math.ceil( rangeProperty.value.max - options.step ); // snap to integer value
      const min = max - rangeLength;
      rangeProperty.value = new Range( min, max );
    };
    const backButton = new ArrowButton( 'left', back,
      merge( {
        tandem: options.tandem.createTandem( 'backButton' )
      }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
    );

    // forward button
    const forward = () => {
      const max = Math.floor( rangeProperty.value.max + options.step ); // snap to integer value
      const min = max - rangeLength;
      rangeProperty.value = new Range( min, max );
    };
    const forwardButton = new ArrowButton( 'right', forward,
      merge( {
        tandem: options.tandem.createTandem( 'forwardButton' )
      }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
    );

    assert && assert( !options.children, 'GenerationScrollControl sets children' );
    options.children = [ backButton, labelNode, forwardButton ];

    super( options );

    // Enable buttons
    Property.multilink(
      [ rangeProperty, maxProperty ],
      ( range, max ) => {
        backButton.enabled = ( range.min > 0 );
        forwardButton.enabled = ( range.max < max );
      } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'GenerationScrollControl does not support dispose' );
  }
}

naturalSelection.register( 'GenerationScrollControl', GenerationScrollControl );
export default GenerationScrollControl;