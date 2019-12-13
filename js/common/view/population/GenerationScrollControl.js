// Copyright 2019, University of Colorado Boulder

/**
 * GenerationScrollControl is the control used for scrolling the x axis (Generation) of the Population graph.
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
     * @param {Property.<number>} valueProperty
     * @param {Property.<number>} maxValueProperty
     * @param {Property.<boolean>} isPlayingProperty
     * @param {Object} [options]
     */
    constructor( valueProperty, maxValueProperty, isPlayingProperty, options ) {

      options = merge( {

        step: 1, // {number} amount to step the range
        scrollWidth: 1,
        labelString: '', // {string} label that appears between the arrow buttons
        font: NaturalSelectionConstants.POPULATION_AXIS_FONT,

        // HBox options
        spacing: 10,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // label
      const labelNode = new Text( options.labelString, {
        font: options.font,
        maxWidth: 120 // determined empirically
      } );

      // back button
      const back = () => {
        isPlayingProperty.value = false; // pause the sim when we scroll back
        valueProperty.value = Math.ceil( valueProperty.value - options.step ); // snap to integer value
      };
      const backButton = new ArrowButton( 'left', back,
        merge( {
          tandem: options.tandem.createTandem( 'backButton' )
        }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
      );

      // forward button
      const forward = () => {
        valueProperty.value = Math.floor( valueProperty.value + options.step ); // snap to integer value
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
        [ valueProperty, maxValueProperty ],
        ( value, maxValue ) => {
          backButton.enabled = ( value - options.scrollWidth > 0 );
          forwardButton.enabled = ( maxValue > value  );
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