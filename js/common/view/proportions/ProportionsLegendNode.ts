// Copyright 2019-2025, University of Colorado Boulder

/**
 * ProportionsLegendNode displays the legend in the control panel for the Proportions graph.
 * It shows the color-coding and fill styles used for each allele.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions, optionize4 } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import HBox, { HBoxOptions } from '../../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import TColor from '../../../../../scenery/js/util/TColor.js';
import naturalSelection from '../../../naturalSelection.js';
import Gene from '../../model/Gene.js';
import GenePool from '../../model/GenePool.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import HatchingRectangle from '../HatchingRectangle.js';

const RECTANGLE_WIDTH = 25;
const RECTANGLE_HEIGHT = 15;

type SelfOptions = EmptySelfOptions;

type ProportionsLegendNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class ProportionsLegendNode extends VBox {

  private readonly legendNodes: GeneLegendNode[];

  public constructor( genePool: GenePool, providedOptions: ProportionsLegendNodeOptions ) {

    const options = optionize4<ProportionsLegendNodeOptions, SelfOptions, VBoxOptions>()(
      {}, NaturalSelectionConstants.VBOX_OPTIONS, {

        // VBoxOptions
        align: 'left',
        spacing: 25,
        visiblePropertyOptions: {
          phetioFeatured: true
        },
        isDisposable: false
      }, providedOptions );

    // A legend for each gene
    const legendNodes = _.map( genePool.genes, gene =>
      new GeneLegendNode( gene, {
        tandem: options.tandem.createTandem( `${gene.tandemNamePrefix}LegendNode` ),
        normalTandemName: `${gene.normalAllele.tandemNamePrefix}LegendNode`,
        mutantTandemName: `${gene.mutantAllele.tandemNamePrefix}LegendNode`
      } ) );

    options.children = legendNodes;

    super( options );

    this.legendNodes = legendNodes;
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   */
  public setGeneVisible( gene: Gene, visible: boolean ): void {
    const legendNode = _.find( this.legendNodes, legendNode => ( legendNode.gene === gene ) )!;
    assert && assert( legendNode, `legendNode not found for ${gene.nameProperty.value} gene` );
    legendNode.visible = visible;
  }
}

/**
 * GeneLegendNode is the legend for one gene. It shows the color and fill-style used for both the normal allele and
 * the mutation allele.
 */

type GeneLegendNodeSelfOptions = {
  normalTandemName: string; // tandem name for the normal allele
  mutantTandemName: string; // tandem name for the mutant allele
};

type GeneLegendNodeOptions = GeneLegendNodeSelfOptions & PickRequired<VBoxOptions, 'tandem'>;

class GeneLegendNode extends VBox {

  public readonly gene: Gene;

  public constructor( gene: Gene, providedOptions: GeneLegendNodeOptions ) {

    const options = optionize4<GeneLegendNodeOptions, GeneLegendNodeSelfOptions, VBoxOptions>()(
      {}, NaturalSelectionConstants.VBOX_OPTIONS, {

        // VBoxOptions
        visiblePropertyOptions: { phetioReadOnly: true },
        isDisposable: false
      }, providedOptions );

    options.children = [
      new AlleleLegendNode( gene.normalAllele.nameProperty, gene.color, {
        tandem: options.tandem.createTandem( options.normalTandemName )
      } ),
      new AlleleLegendNode( gene.mutantAllele.nameProperty, gene.color, {
        isMutant: true,
        tandem: options.tandem.createTandem( options.mutantTandemName )
      } )
    ];

    super( options );

    this.gene = gene;
  }
}

/**
 * AlleleLegendNode is the legend for one allele. It describes the color and fill style used for a specific allele.
 * Mutations are use a hatching fill style, while non-mutations use a solid fill style.
 */

type AlleleLegendNodeSelfOptions = {
  isMutant?: boolean; // whether the allele is mutant, affects the fill style used
};

type AlleleLegendNodeOptions = AlleleLegendNodeSelfOptions & PickRequired<HBoxOptions, 'tandem'>;

class AlleleLegendNode extends HBox {

  public constructor( alleleNameProperty: TReadOnlyProperty<string>, color: TColor, providedOptions: AlleleLegendNodeOptions ) {

    const options = optionize<AlleleLegendNodeOptions, AlleleLegendNodeSelfOptions, HBoxOptions>()( {

      // AlleleLegendNodeSelfOptions
      isMutant: false,

      // HBoxOptions
      spacing: 5,
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    const rectangleOptions = {
      fill: color,
      stroke: color
    };
    const rectangleNode = options.isMutant ?
                          new HatchingRectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, rectangleOptions ) :
                          new Rectangle( 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT, rectangleOptions );

    const text = new Text( alleleNameProperty, {
      font: NaturalSelectionConstants.PROPORTIONS_LEGEND_FONT,
      maxWidth: 92 // determined empirically
    } );

    options.children = [ rectangleNode, text ];

    super( options );
  }
}

naturalSelection.register( 'ProportionsLegendNode', ProportionsLegendNode );