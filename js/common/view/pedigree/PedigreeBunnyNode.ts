// Copyright 2020-2022, University of Colorado Boulder

/**
 * PedigreeBunnyNode is the view of a bunny in the Pedigree graph. It ignores bunny motion, and displays
 * only the information that is relevant to pedigree.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Property from '../../../../../axon/js/Property.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Text } from '../../../../../scenery/js/imports.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import BunnyImageMap from '../BunnyImageMap.js';
import BunnySelectionRectangle from '../BunnySelectionRectangle.js';
import MutationIconNode from '../MutationIconNode.js';
import OriginNode from '../OriginNode.js';

// constants
const GENOTYPE_FONT = new PhetFont( 16 );
const DEAD_SYMBOL_FONT = new PhetFont( 20 );
const UNICODE_RED_CROSS_MARK = '\u274c';

type SelfOptions = {
  showMutationIcon?: boolean; // true = show the mutation icon on the bunny
  bunnyIsSelected?: boolean; // true = put a selection icon around the bunny
};

type PedigreeBunnyNodeOptions = SelfOptions;

export default class PedigreeBunnyNode extends Node {

  private readonly disposePedigreeBunnyNode: () => void;

  public constructor( bunny: Bunny,
                      bunnyImageMap: BunnyImageMap,
                      furAllelesVisibleProperty: Property<boolean>,
                      earsAllelesVisibleProperty: Property<boolean>,
                      teethAllelesVisibleProperty: Property<boolean>,
                      providedOptions?: PedigreeBunnyNodeOptions ) {

    const options = optionize<PedigreeBunnyNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      showMutationIcon: true,
      bunnyIsSelected: false

      // Not PhET-iO instrumented: PedigreeBunnyNode is created dynamically, and clients generally have no need to inspect them.
    }, providedOptions );

    const children = [];

    // Node that corresponds to the bunny's phenotype (appearance)
    const bunnyNode = bunnyImageMap.getNode( bunny, {
      scale: NaturalSelectionConstants.BUNNY_IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );
    children.push( bunnyNode );

    // Label original mutant with an icon
    if ( bunny.isOriginalMutant() ) {
      children.push( new MutationIconNode( {
        right: bunnyNode.centerX,
        bottom: bunnyNode.bottom,
        pickable: false
      } ) );
    }

    // Update the genotype abbreviation, must be disposed
    // Not instrumented because we decided not to instrument PedigreeBunnyNode.
    const genotypeDerivedStringProperty = DerivedProperty.deriveAny(
      [
        furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty,
        ...bunny.genotype.getAbbreviationStringDependencies()
      ],
      () =>
        getGenotypeAbbreviation( bunny, furAllelesVisibleProperty.value, earsAllelesVisibleProperty.value, teethAllelesVisibleProperty.value )
    );

    // Must be disposed
    const genotypeTextVisibleProperty = new DerivedProperty(
      [ furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty ],
      ( furAllelesVisible, earsAllelesVisible, teethAllelesVisible ) =>
        ( furAllelesVisible || earsAllelesVisible || teethAllelesVisible )
    );

    // Genotype abbreviation
    // Not instrumented because we decided not to instrument PedigreeBunnyNode.
    const genotypeText = new Text( genotypeDerivedStringProperty, {
      visibleProperty: genotypeTextVisibleProperty,
      font: GENOTYPE_FONT,
      maxWidth: bunnyNode.width
    } );
    children.push( genotypeText );

    // Center the genotype abbreviation above the bunny.
    genotypeText.boundsProperty.link( () => {
      genotypeText.centerX = bunnyNode.centerX;
      genotypeText.top = bunnyNode.bottom + 5;
    } );

    // Optional selection rectangle, prepended to children
    if ( options.bunnyIsSelected ) {
      children.unshift( new BunnySelectionRectangle( bunnyNode.bounds.dilated( 3 ), {
        center: bunnyNode.center
      } ) );
    }

    if ( NaturalSelectionQueryParameters.showOrigin ) {
      children.push( new OriginNode() );
    }

    options.children = children;

    super( options );

    // Label a dead bunny with a red cross mark.  This Text node does not take a string Property because it
    // displays a static symbol that is not translatable.
    const addRedCrossMark = () => {
      this.addChild( new Text( UNICODE_RED_CROSS_MARK, {
        font: DEAD_SYMBOL_FONT,
        right: bunnyNode.centerX,
        bottom: bunnyNode.centerY
      } ) );
    };
    if ( bunny.isAlive ) {

      // removeListener in dispose. Not necessary to removeListener when diedEmitter fires, because it disposes itself.
      bunny.diedEmitter.addListener( addRedCrossMark );
    }
    else {
      addRedCrossMark();
    }

    this.disposePedigreeBunnyNode = () => {
      genotypeDerivedStringProperty.dispose();
      genotypeTextVisibleProperty.dispose();
      if ( bunny.diedEmitter.hasListener( addRedCrossMark ) ) {
        bunny.diedEmitter.removeListener( addRedCrossMark );
      }

      // Un-parent the bunnyNode from the shared DAG
      bunnyNode.dispose();
    };

    // If logging is enabled, pressing on a bunny logs its details to the console.
    // removeInput listener is not necessary.
    if ( phet.log ) {
      this.addInputListener( {
        down: () => phet.log( `Pedigree press: ${bunny.toString()}` )
      } );
    }
  }

  public override dispose(): void {
    this.disposePedigreeBunnyNode();
    super.dispose();
  }
}

/**
 * Gets the abbreviations that describe a Bunny's genotype, e.g. 'FfEEtt'.
 */
function getGenotypeAbbreviation( bunny: Bunny, furAllelesVisible: boolean, earsAllelesVisible: boolean,
                                  teethAllelesVisible: boolean ): string {

  let genotypeString = '';

  if ( furAllelesVisible ) {
    genotypeString += bunny.genotype.furGenePair.getGenotypeAbbreviation();
  }

  if ( earsAllelesVisible ) {
    genotypeString += bunny.genotype.earsGenePair.getGenotypeAbbreviation();
  }

  if ( teethAllelesVisible ) {
    genotypeString += bunny.genotype.teethGenePair.getGenotypeAbbreviation();
  }

  return genotypeString;
}

naturalSelection.register( 'PedigreeBunnyNode', PedigreeBunnyNode );