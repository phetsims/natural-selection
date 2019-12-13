// Copyright 2019, University of Colorado Boulder

/**
 * ScrollControl is the control for 1-dimensional scrolling.
 * In this sim, it's used for scrolling the x axis of the Population graph.
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

  class ScrollControl extends HBox {

    /**
     * @param {Property.<Range>} visibleRangeProperty - visible range of the quantity
     * @param {Property.<Range>} totalRangeProperty - total range of the quantity
     * @param {Object} [options]
     */
    constructor( visibleRangeProperty, totalRangeProperty, options ) {

      options = merge( {

        step: 1, // {number} amount to step the range
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
        visibleRangeProperty.value =
          new Range( visibleRangeProperty.value.min - options.step, visibleRangeProperty.value.max - options.step );
      };
      const backButton = new ArrowButton( 'left', back,
        merge( {
          tandem: options.tandem.createTandem( 'backButton' )
        }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
      );

      // forward button
      const forward = () => {
        visibleRangeProperty.value =
          new Range( visibleRangeProperty.value.min + options.step, visibleRangeProperty.value.max + options.step );
      };
      const forwardButton = new ArrowButton( 'right', forward,
        merge( {
          tandem: options.tandem.createTandem( 'forwardButton' )
        }, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS )
      );

      assert && assert( !options.children, 'ScrollControl sets children' );
      options.children = [ backButton, labelNode, forwardButton ];

      super( options );

      // Enable buttons based on the ranges
      const multilink = Property.multilink(
        [ visibleRangeProperty, totalRangeProperty ],
        ( visibleRange, totalRange ) => {
          backButton.enabled = ( totalRange.min <= visibleRange.min - options.step );
          forwardButton.enabled = ( totalRange.max >= visibleRange.max + options.step );
        } );

      // @private
      this.disposeScrollControl = () => {
        multilink.dispose();
      };
    }

    dispose() {
      super.dispose();
      this.disposeScrollControl();
    }
  }

  return naturalSelection.register( 'ScrollControl', ScrollControl );
} );