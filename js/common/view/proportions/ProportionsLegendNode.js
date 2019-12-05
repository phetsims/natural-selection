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
  const NaturalSelectionColors = require( 'NATURAL_SELECTION/common/NaturalSelectionColors' );
  const NaturalSelectionConstants = require( 'NATURAL_SELECTION/common/NaturalSelectionConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  // strings
  const brownFurString = require( 'string!NATURAL_SELECTION/brownFur' );
  const straightEarsString = require( 'string!NATURAL_SELECTION/straightEars' );
  const floppyEarsString = require( 'string!NATURAL_SELECTION/floppyEars' );
  const longTeethString = require( 'string!NATURAL_SELECTION/longTeeth' );
  const shortTeethString = require( 'string!NATURAL_SELECTION/shortTeeth' );
  const whiteFurString = require( 'string!NATURAL_SELECTION/whiteFur' );

  // constants
  const RECTANGLE_WIDTH = 25;
  const RECTANGLE_HEIGHT = 15;

  class ProportionsLegendNode extends VBox {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, options );

      assert && assert( !options.children, 'ProportionsLegendNode sets children' );
      options.children = [

        // ... with struts to visually group alleles for each trait
        new Row( whiteFurString, NaturalSelectionColors.FUR, false /* isMutation */ ),
        new Row( brownFurString, NaturalSelectionColors.FUR, true ),
        new VStrut( 1 ),
        new Row( straightEarsString, NaturalSelectionColors.EARS, false ),
        new Row( floppyEarsString, NaturalSelectionColors.EARS, true ),
        new VStrut( 1 ),
        new Row( shortTeethString, NaturalSelectionColors.TEETH, false ),
        new Row( longTeethString, NaturalSelectionColors.TEETH, true )
      ];

      super( options );
    }
  }

  /**
   * Row is a row in ProportionsLegendNode. It describes the color and fill style used for a specific allele.
   * Mutations are use a hatching fill style, while non-mutations use a solid fill style.
   */
  class Row extends HBox {

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