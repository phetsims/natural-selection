// Copyright 2019-2020, University of Colorado Boulder

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
  const Tandem = require( 'TANDEM/Tandem' );
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

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, NaturalSelectionConstants.VBOX_OPTIONS, options );

      assert && assert( !options.children, 'ProportionsLegendNode sets children' );
      options.children = [

        // Fur
        new Row( whiteFurString, NaturalSelectionColors.FUR, false /* isMutation */, {
          tandem: options.tandem.createTandem( 'whiteFurNode' )
        } ),
        new Row( brownFurString, NaturalSelectionColors.FUR, true, {
          tandem: options.tandem.createTandem( 'brownFurNode' )
        } ),

        // ... with struts to visually group alleles for each trait
        new VStrut( 1 ),

        // Ears
        new Row( straightEarsString, NaturalSelectionColors.EARS, false, {
          tandem: options.tandem.createTandem( 'straightEarsNode' )
        } ),
        new Row( floppyEarsString, NaturalSelectionColors.EARS, true, {
          tandem: options.tandem.createTandem( 'floppyEarsNode' )
        } ),

        new VStrut( 1 ),

        // Teeth
        new Row( shortTeethString, NaturalSelectionColors.TEETH, false, {
          tandem: options.tandem.createTandem( 'shortTeethNode' )
        } ),
        new Row( longTeethString, NaturalSelectionColors.TEETH, true, {
          tandem: options.tandem.createTandem( 'longTeethNode' )
        } )
      ];

      super( options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'ProportionsLegendNode does not support dispose' );
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

      const rectangleOptions = {
        fill: color,
        stroke: color
      };
      const rectangleNode = isMutation ?
                            new HatchingRectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, rectangleOptions ) :
                            new Rectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, rectangleOptions );


      const textNode = new Text( labelString, {
        font: NaturalSelectionConstants.PROPORTIONS_LEGEND_FONT,
        maxWidth: 92 // determined empirically
      } );

      assert && assert( !options.children, 'ProportionsLegendNode sets children' );
      options.children = [ rectangleNode, textNode ];

      super( options );
    }

    /**
     * @public
     * @override
     */
    dispose() {
      assert && assert( false, 'Row does not support dispose' );
    }
  }

  return naturalSelection.register( 'ProportionsLegendNode', ProportionsLegendNode );
} );