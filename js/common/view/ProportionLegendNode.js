// Copyright 2019, University of Colorado Boulder

/**
 * ProportionLegendNode is a legend item in the control panel for the Proportion graph.
 * It showings the color and fill style used.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  class ProportionLegendNode extends HBox {

    /**
     * @param {string} textString
     * @param {Object} [options]
     */
    constructor( textString, options ) {

      options = merge( {

        // options passed to Rectangle
        rectangleOptions: {
          fill: 'black',
          stroke: null
        },

        // HBox options
        spacing: 5
      }, options );

      const rectangleNode = new Rectangle( 0, 0, 25, 15, options.rectangleOptions );

      const textNode = new Text( textString, {
        font: NaturalSelectionConstants.CHECKBOX_FONT // use the same font that as checkbox labels
      } );

      assert && assert( !options.children, 'ProportionLegendNode sets children' );
      options.children = [ rectangleNode, textNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'ProportionLegendNode', ProportionLegendNode );
} );