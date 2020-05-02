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
import Color from '../../../../../scenery/js/util/Color.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
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
      align: 'left',

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.VBOX_OPTIONS, options );

    assert && assert( options.spacing, 'ProportionsLegendNode sets spacing' );
    options.spacing = 25;

    assert && assert( !options.children, 'ProportionsLegendNode sets children' );
    options.children = [

      //TODO get colors and strings from Genes
      // Fur
      new TraitLegendNode( NaturalSelectionColors.FUR,
        naturalSelectionStrings.whiteFur, 'whiteFurLegendNode',
        naturalSelectionStrings.brownFur, 'brownFurLegendNode', {
          tandem: options.tandem.createTandem( 'furLegendNode' )
        } ),

      // Ears
      new TraitLegendNode( NaturalSelectionColors.EARS,
        naturalSelectionStrings.straightEars, 'straightEarsLegendNode',
        naturalSelectionStrings.floppyEars, 'floppyEarsLegendNode', {
          tandem: options.tandem.createTandem( 'earsLegendNode' )
        } ),

      // Teeth
      new TraitLegendNode( NaturalSelectionColors.TEETH,
        naturalSelectionStrings.shortTeeth, 'shortTeethLegendNode',
        naturalSelectionStrings.longTeeth, 'longTeethLegendNode', {
          tandem: options.tandem.createTandem( 'teethLegendNode' )
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
 * TraitLegendNode is the legend for one trait. It shows the color and fill-style used for both the normal allele and
 * the mutation allele.
 */
class TraitLegendNode extends VBox {

  /**
   * @param {Color|string } color - color for the trait
   * @param {string} normalName - name of the normal allele
   * @param {string} normalTandemName - tandem name of the normal allele
   * @param {string} mutationName - name of the mutation allele
   * @param {string} mutationTandemName - tandem name of the mutation allele
   * @param {Object} [options]
   */
  constructor( color, normalName, normalTandemName, mutationName, mutationTandemName, options ) {

    assert && assert( color instanceof Color || typeof color === 'string', 'invalid color' );
    assert && assert( typeof normalName === 'string', 'invalid normalName' );
    assert && assert( typeof normalTandemName === 'string', 'invalid normalTandemName' );
    assert && assert( typeof mutationName === 'string', 'invalid mutationName' );
    assert && assert( typeof mutationTandemName === 'string', 'invalid mutationTandemName' );

    assert && assert( options && options.tandem, 'missing required tandem' );

    options = merge( {
      children: [
        new AlleleLegendNode( normalName, color, {
          isMutant: false,
          tandem: options.tandem.createTandem( normalTandemName )
        } ),
        new AlleleLegendNode( mutationName, color, {
          isMutant: true,
          tandem: options.tandem.createTandem( mutationTandemName )
        } )
      ]
    }, NaturalSelectionConstants.VBOX_OPTIONS, options );

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'TraitLegendNode does not support dispose' );
  }
}

/**
 * AlleleLegendNode is the legend for one allele. It describes the color and fill style used for a specific allele.
 * Mutations are use a hatching fill style, while non-mutations use a solid fill style.
 */
class AlleleLegendNode extends HBox {

  /**
   * @param {string} name
   * @param {Color|string} color
   * @param {Object} [options]
   */
  constructor( name, color, options ) {

    assert && assert( typeof name === 'string', 'invalid name' );
    assert && assert( color instanceof Color || typeof color === 'string', 'invalid color' );

    options = merge( {

      isMutant: false, // true = mutant allele, false = normal allele

      // HBox options
      spacing: 5
    }, options );

    const rectangleOptions = {
      fill: color,
      stroke: color
    };
    const rectangleNode = options.isMutant ?
                          new HatchingRectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, rectangleOptions ) :
                          new Rectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, rectangleOptions );

    const textNode = new Text( name, {
      font: NaturalSelectionConstants.PROPORTIONS_LEGEND_FONT,
      maxWidth: 92 // determined empirically
    } );

    assert && assert( !options.children, 'AlleleLegendNode sets children' );
    options.children = [ rectangleNode, textNode ];

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'AlleleLegendNode does not support dispose' );
  }
}

naturalSelection.register( 'ProportionsLegendNode', ProportionsLegendNode );
export default ProportionsLegendNode;