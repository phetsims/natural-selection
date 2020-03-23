// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsLegendNode is a legend item in the control panel for the Proportions graph.
 * It showings the fill style used for an allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import VStrut from '../../../../../scenery/js/nodes/VStrut.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelectionStrings from '../../../natural-selection-strings.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import HatchingRectangle from '../HatchingRectangle.js';

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
      new Row( naturalSelectionStrings.whiteFur, NaturalSelectionColors.FUR, false /* isMutation */, {
        tandem: options.tandem.createTandem( 'whiteFurNode' )
      } ),
      new Row( naturalSelectionStrings.brownFur, NaturalSelectionColors.FUR, true, {
        tandem: options.tandem.createTandem( 'brownFurNode' )
      } ),

      // ... with struts to visually group alleles for each trait
      new VStrut( 1 ),

      // Ears
      new Row( naturalSelectionStrings.straightEars, NaturalSelectionColors.EARS, false, {
        tandem: options.tandem.createTandem( 'straightEarsNode' )
      } ),
      new Row( naturalSelectionStrings.floppyEars, NaturalSelectionColors.EARS, true, {
        tandem: options.tandem.createTandem( 'floppyEarsNode' )
      } ),

      new VStrut( 1 ),

      // Teeth
      new Row( naturalSelectionStrings.shortTeeth, NaturalSelectionColors.TEETH, false, {
        tandem: options.tandem.createTandem( 'shortTeethNode' )
      } ),
      new Row( naturalSelectionStrings.longTeeth, NaturalSelectionColors.TEETH, true, {
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

naturalSelection.register( 'ProportionsLegendNode', ProportionsLegendNode );
export default ProportionsLegendNode;