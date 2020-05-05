// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsLegendNode displays the legend in the control panel for the Proportions graph.
 * It showings the color-coding and fill styles used for each allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import required from '../../../../../phet-core/js/required.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../../scenery/js/util/Color.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import Gene from '../../model/Gene.js';
import GenePool from '../../model/GenePool.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import HatchingRectangle from '../HatchingRectangle.js';

// constants
const RECTANGLE_WIDTH = 25;
const RECTANGLE_HEIGHT = 15;

class ProportionsLegendNode extends VBox {

  /**
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( genePool, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {
      align: 'left',

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.VBOX_OPTIONS, options );

    assert && assert( options.spacing, 'ProportionsLegendNode sets spacing' );
    options.spacing = 25;

    const furLegendNode = new GeneLegendNode( genePool.furGene, {
      tandem: options.tandem.createTandem( 'furLegendNode' ),
      normalTandemName: 'whiteFurLegendNode',
      mutantTandemName: 'brownFurLegendNode'
    } );

    const earsLegendNode = new GeneLegendNode( genePool.earsGene, {
      tandem: options.tandem.createTandem( 'earsLegendNode' ),
      normalTandemName: 'straightEarsLegendNode',
      mutantTandemName: 'floppyEarsLegendNode'
    } );

    const teethLegendNode = new GeneLegendNode( genePool.teethGene, {
      tandem: options.tandem.createTandem( 'teethLegendNode' ),
      normalTandemName: 'shortTeethLegendNode',
      mutantTandemName: 'longTeethLegendNode'
    } );

    assert && assert( !options.children, 'ProportionsLegendNode sets children' );
    options.children = [
      furLegendNode,
      earsLegendNode,
      teethLegendNode
    ];

    super( options );

    // @public for configuring Intro screen only
    this.earsLegendNode = earsLegendNode;
    this.teethLegendNode = teethLegendNode;
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
 * GeneLegendNode is the legend for one gene. It shows the color and fill-style used for both the normal allele and
 * the mutation allele.
 */
class GeneLegendNode extends VBox {

  /**
   * @param {Gene} gene
   * @param {Object} [options]
   */
  constructor( gene, options ) {

    assert && assert( gene instanceof Gene, 'invalid gene' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      normalTandemName: required( null ), // tandem name for the normal allele
      mutantTandemName: required( null ) // tandem name for the mutant allele
    }, options );

    assert && assert( !options.children, 'GeneLegendNode sets children' );
    options = merge( {
      children: [
        new AlleleLegendNode( gene.normalAllele.name, gene.color, {
          tandem: options.tandem.createTandem( options.normalTandemName )
        } ),
        new AlleleLegendNode( gene.mutantAllele.name, gene.color, {
          isMutant: true,
          tandem: options.tandem.createTandem( options.mutantTandemName )
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
    assert && assert( false, 'GeneLegendNode does not support dispose' );
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

      // whether the allele is mutant, affects the fill style used
      isMutant: false,

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