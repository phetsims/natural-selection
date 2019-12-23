// Copyright 2019, University of Colorado Boulder

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

      // Maintain the intial range length
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
        rangeProperty.value.setMinMax( min, max ); // mutate value
        rangeProperty.notifyListenersStatic(); // force notification
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
        rangeProperty.value.setMinMax( min, max ); // mutate value
        rangeProperty.notifyListenersStatic(); // force notification
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
      const multilink = Property.multilink(
        [ rangeProperty, maxProperty ],
        ( range, max ) => {
          backButton.enabled = ( range.min > 0 );
          forwardButton.enabled = ( range.max < max  );
        } );

      // @private
      this.disposeGenerationScrollControl = () => {
        multilink.dispose();
      };
    }

    /**
     * @public
     * @override
     */
    dispose() {
      super.dispose();
      this.disposeGenerationScrollControl();
    }
  }

  return naturalSelection.register( 'GenerationScrollControl', GenerationScrollControl );
} );