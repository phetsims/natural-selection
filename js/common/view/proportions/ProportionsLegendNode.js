// Copyright 2019-2022, University of Colorado Boulder

/**
 * ProportionsLegendNode displays the legend in the control panel for the Proportions graph.
 * It shows the color-coding and fill styles used for each allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import merge from '../../../../../phet-core/js/merge.js';
import required from '../../../../../phet-core/js/required.js';
import { Color, HBox, Rectangle, Text, VBox } from '../../../../../scenery/js/imports.js';
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

    // A legend for each gene
    const legendNodes = _.map( genePool.genes, gene =>
      new GeneLegendNode( gene, {
        tandem: options.tandem.createTandem( `${gene.tandemPrefix}LegendNode` ),
        normalTandemName: `${gene.normalAllele.tandemPrefix}LegendNode`,
        mutantTandemName: `${gene.mutantAllele.tandemPrefix}LegendNode`
      } ) );

    assert && assert( !options.children, 'ProportionsLegendNode sets children' );
    options.children = legendNodes;

    super( options );

    // @private {GeneLegendNode[]}
    this.legendNodes = legendNodes;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   * @param {Gene} gene
   * @param {boolean} visible
   * @public
   */
  setGeneVisible( gene, visible ) {
    assert && assert( gene instanceof Gene, 'invalid gene' );
    assert && assert( typeof visible === 'boolean', 'invalid visible' );

    const legendNode = _.find( this.legendNodes, legendNode => ( legendNode.gene === gene ) );
    assert && assert( legendNode, `legendNode not found for ${gene.name} gene` );
    legendNode.visible = visible;
  }
}

/**
 * GeneLegendNode is the legend for one gene. It shows the color and fill-style used for both the normal allele and
 * the mutation allele.
 */
class GeneLegendNode extends VBox {

  /**
   * @param {Gene} gene
   * @param {Object} config
   */
  constructor( gene, config ) {

    assert && assert( gene instanceof Gene, 'invalid gene' );

    config = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      visiblePropertyOptions: { phetioReadOnly: true },
      normalTandemName: required( config.normalTandemName ), // tandem name for the normal allele
      mutantTandemName: required( config.mutantTandemName ) // tandem name for the mutant allele
    }, config );

    assert && assert( !config.children, 'GeneLegendNode sets children' );
    config = merge( {
      children: [
        new AlleleLegendNode( gene.normalAllele.nameProperty, gene.color, {
          tandem: config.tandem.createTandem( config.normalTandemName )
        } ),
        new AlleleLegendNode( gene.mutantAllele.nameProperty, gene.color, {
          isMutant: true,
          tandem: config.tandem.createTandem( config.mutantTandemName )
        } )
      ]
    }, NaturalSelectionConstants.VBOX_OPTIONS, config );

    super( config );

    // @public (read-only)
    this.gene = gene;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'GeneLegendNode does not support dispose' );
    super.dispose();
  }
}

/**
 * AlleleLegendNode is the legend for one allele. It describes the color and fill style used for a specific allele.
 * Mutations are use a hatching fill style, while non-mutations use a solid fill style.
 */
class AlleleLegendNode extends HBox {

  /**
   * @param {TReadOnlyProperty<string>} alleleNameProperty
   * @param {Color|string} color
   * @param {Object} [options]
   */
  constructor( alleleNameProperty, color, options ) {

    assert && assert( alleleNameProperty instanceof ReadOnlyProperty, 'invalid alleleNameProperty' );
    assert && assert( color instanceof Color || typeof color === 'string', 'invalid color' );

    options = merge( {

      // whether the allele is mutant, affects the fill style used
      isMutant: false,

      // HBox options
      spacing: 5,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioVisiblePropertyInstrumented: false
    }, options );

    const rectangleOptions = {
      fill: color,
      stroke: color
    };
    const rectangleNode = options.isMutant ?
                          new HatchingRectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, rectangleOptions ) :
                          new Rectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, rectangleOptions );

    const textNode = new Text( alleleNameProperty, {
      font: NaturalSelectionConstants.PROPORTIONS_LEGEND_FONT,
      maxWidth: 92, // determined empirically
      tandem: options.tandem.createTandem( 'textNode' ),
      phetioVisiblePropertyInstrumented: false
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
    super.dispose();
  }
}

naturalSelection.register( 'ProportionsLegendNode', ProportionsLegendNode );
export default ProportionsLegendNode;