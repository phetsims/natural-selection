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
  const HatchingRectangle = require( 'NATURAL_SELECTION/common/view/HatchingRectangle' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  class ProportionLegendNode extends HBox {

    /**
     * @param {label:string, property:Property.<Boolean>, color:Color|string, lineStyle:string} trait
     * @param {Object} [options]
     */
    constructor( trait, options ) {

      options = merge( {

        // options passed to Rectangle
        rectangleOptions: {
          fill: 'black',
          stroke: null
        },

        // HBox options
        spacing: 5
      }, options );

      let rectangleNode = null;
      if ( trait.lineStyle === 'solid' ) {
        rectangleNode = new Rectangle( 0, 0, 25, 15, {
          fill: trait.color
        } );
      }
      else {
        rectangleNode = new HatchingRectangle( 0, 0, 25, 15, {
          fill: trait.color
        } );
      }

      const textNode = new Text( trait.label, {
        font: NaturalSelectionConstants.TEXT_FONT
      } );

      assert && assert( !options.children, 'ProportionLegendNode sets children' );
      options.children = [ rectangleNode, textNode ];

      super( options );
    }
  }

  return naturalSelection.register( 'ProportionLegendNode', ProportionLegendNode );
} );