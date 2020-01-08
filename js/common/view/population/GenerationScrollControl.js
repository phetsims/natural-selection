// Copyright 2019-2020, University of Colorado Boulder

/**
 * GenerationScrollControl is the control used for scrolling the x-axis (Generation) of the Population graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const merge = require( 'PHET_CORE/merge' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );

  class GenerationScrollControl extends HBox {

    /**
     * @param {Property.<Range>} rangeProperty
     * @param {Property.<number>} maxProperty - maximum value for rangeProperty.value.max
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Object} [options]
     */
    constructor( rangeProperty, maxProperty, isPlayingProperty, options ) {

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
        maxWidth: 120 // determined empirically
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

  return naturalSelection.register( 'GenerationScrollControl', GenerationScrollControl );
} );