// Copyright 2019, University of Colorado Boulder

/**
 * PanControl is the control for 1-dimensional panning.
 * In this sim, it's used for panning the x axis of the Population graph.
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
  const Text = require( 'SCENERY/nodes/Text' );

  class PanControl extends HBox {

    /**
     * @param {string} labelString
     * @param {Object} [options]
     */
    constructor( labelString, options ) {

      options = merge( {
        font: NaturalSelectionConstants.POPULATION_AXIS_FONT,
        previous: () => {},
        next: () => {},

        // HBox options
        spacing: 10
      }, options );

      // label
      const xAxisLabelNode = new Text( labelString, {
        font: options.font,
        maxWidth: 120 // determined empirically
      } );

      // buttons
      const previousButton = new ArrowButton( 'left', options.previous, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS );
      const nextButton = new ArrowButton( 'right', options.next, NaturalSelectionConstants.ARROW_BUTTON_OPTIONS );

      assert && assert( !options.children, 'PanControl sets children' );
      options.children = [ previousButton, xAxisLabelNode, nextButton ];

      super( options );
    }
  }

  return naturalSelection.register( 'PanControl', PanControl );
} );