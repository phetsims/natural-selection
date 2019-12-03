// Copyright 2019, University of Colorado Boulder

/**
 * ProportionsLegendNode is a legend item in the control panel for the Proportions graph.
 * It showings the fill style used for an allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HatchingRectangle = require( 'NATURAL_SELECTION/common/view/HatchingRectangle' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const RECTANGLE_WIDTH = 25;
  const RECTANGLE_HEIGHT = 15;

  class ProportionsLegendNode extends HBox {

    /**
     * @param {string} labelString
     * @param {Color|string} color
     * @param {boolean} isMutation
     * @param {Object} [options]
     */
    constructor( labelString, color, isMutation, options ) {

      options = merge( {

        // HBox options
        spacing: 5
      }, options );

      const rectangleNode = isMutation ?
                            new HatchingRectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, { fill: color } ) :
                            new Rectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, { fill: color } );


      const textNode = new Text( labelString, {
        font: NaturalSelectionConstants.PROPORTIONS_LEGEND_FONT,
        maxWidth: 92 // determined empirically
      } );

      assert && assert( !options.children, 'ProportionsLegendNode sets children' );
      options.children = [ rectangleNode, textNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'ProportionsLegendNode', ProportionsLegendNode );
} );