// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsLegendNode displays the legend in the control panel for the Proportions graph.
 * It showings the color-coding and fill styles used for each allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../../scenery/js/util/Color.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import Gene from '../../model/Gene.js';
import GenePool from '../../model/GenePool.js';
import ProportionsModel from '../../model/ProportionsModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';
import HatchingRectangle from '../HatchingRectangle.js';

// constants
const RECTANGLE_WIDTH = 25;
const RECTANGLE_HEIGHT = 15;

class ProportionsLegendNode extends VBox {

  /**
   * @param {ProportionsModel} proportionsModel
   * @param {GenePool} genePool
   * @param {Object} [options]
   */
  constructor( proportionsModel, genePool, options ) {

    assert && assert( proportionsModel instanceof ProportionsModel, 'invalid proportionsModel' );
    assert && assert( genePool instanceof GenePool, 'invalid genePool' );

    options = merge( {
      align: 'left',

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.VBOX_OPTIONS, options );

    assert && assert( options.spacing, 'ProportionsLegendNode sets spacing' );
    options.spacing = 25;

    const furLegendNode = new GeneCheckbox( genePool.furGene, proportionsModel.furVisibleProperty, {
      tandem: options.tandem.createTandem( 'furLegendNode' )
    } );

    const earsLegendNode = new GeneCheckbox( genePool.earsGene, proportionsModel.earsVisibleProperty, {
      tandem: options.tandem.createTandem( 'earsLegendNode' )
    } );

    const teethLegendNode = new GeneCheckbox( genePool.teethGene, proportionsModel.teethVisibleProperty, {
      tandem: options.tandem.createTandem( 'teethLegendNode' )
    } );

    assert && assert( !options.children, 'ProportionsLegendNode sets children' );
    options.children = [
      furLegendNode,
      earsLegendNode,
      teethLegendNode
    ];

    super( options );

    // @public for configuring ScreenViews only
    this.furLegendNode = furLegendNode;
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
 * GeneCheckbox is a checkbox for showing and hiding a gene in the Proportions graph. It is labeled with a legend
 * that shows the colors and fill-styles used for the normal allele and the mutation allele.
 */
class GeneCheckbox extends Checkbox {

  /**
   * @param {Gene} gene
   * @param {Property.<boolean>} property
   * @param {Object} [options]
   */
  constructor( gene, property, options ) {

    assert && assert( gene instanceof Gene, 'invalid gene' );
    assert && NaturalSelectionUtils.assertPropertyTypeof( property, 'boolean' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
      spacing: 8
    }, options );

    assert && assert( !options.children, 'GeneCheckbox sets children' );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [
        new AlleleLegendNode( gene.normalAllele.name, gene.color ),
        new AlleleLegendNode( gene.mutantAllele.name, gene.color, { isMutant: true} )
      ]
    } ) );

    super( content, property, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'GeneCheckbox does not support dispose' );
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