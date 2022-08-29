// Copyright 2020-2022, University of Colorado Boulder

/**
 * PedigreeBunnyNode is the view of a bunny in the Pedigree graph. It ignores bunny motion, and displays
 * only the information that is relevant to pedigree.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../../scenery/js/imports.js';
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

class PedigreeBunnyNode extends Node {

  /**
   * @param {Bunny} bunny
   * @param {BunnyImageMap} bunnyImageMap
   * @param {Property.<boolean>} furAllelesVisibleProperty
   * @param {Property.<boolean>} earsAllelesVisibleProperty
   * @param {Property.<boolean>} teethAllelesVisibleProperty
   * @param {Object} [options]
   */
  constructor( bunny, bunnyImageMap,
               furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( bunnyImageMap instanceof BunnyImageMap, 'invalid bunnyImageMap' );
    assert && AssertUtils.assertPropertyOf( furAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( earsAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( teethAllelesVisibleProperty, 'boolean' );

    options = merge( {
      showMutationIcon: true,
      bunnyIsSelected: false
    }, options );

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
    const genotypeNodeDerivedStringProperty = new DerivedProperty(
      [
        furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty,
        ...bunny.genotype.getAbbreviationStringDependencies()
      ],
      ( furAllelesVisible, earsAllelesVisible, teethAllelesVisible ) =>
        getGenotypeAbbreviation( bunny, furAllelesVisible, earsAllelesVisible, teethAllelesVisible )
    );

    // Must be disposed
    const genotypeNodeVisibleProperty = new DerivedProperty(
      [ furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty ],
      ( furAllelesVisible, earsAllelesVisible, teethAllelesVisible ) =>
        ( furAllelesVisible || earsAllelesVisible || teethAllelesVisible )
    );

    // Genotype abbreviation
    const genotypeNode = new Text( genotypeNodeDerivedStringProperty, {
      visibleProperty: genotypeNodeVisibleProperty,
      font: GENOTYPE_FONT,
      maxWidth: bunnyNode.width
    } );
    children.push( genotypeNode );

    // Center the genotype abbreviation above the bunny.
    genotypeNode.boundsProperty.link( () => {
      genotypeNode.centerX = bunnyNode.centerX;
      genotypeNode.top = bunnyNode.bottom + 5;
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

    assert && assert( !options.children, 'PedigreeBunnyNode sets children' );
    options.children = children;

    super( options );

    // Label a dead bunny with a red cross mark.
    const addRedCrossMark = () => {

      //TODO https://github.com/phetsims/natural-selection/issues/319 cannot instrument Text because we decided not to instrument PedigreeBunnyNode, verify
      this.addChild( new Text( '\u274c', {
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

    // @private {function}
    this.disposePedigreeBunnyNode = () => {
      genotypeNodeDerivedStringProperty.dispose();
      genotypeNodeVisibleProperty.dispose();
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

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposePedigreeBunnyNode();
    super.dispose();
  }
}

/**
 * Gets the abbreviations that describe a Bunny's genotype, e.g. 'FfEEtt'.
 * @param {Bunny} bunny
 * @param {boolean} furAllelesVisible
 * @param {boolean} earsAllelesVisible
 * @param {boolean} teethAllelesVisible
 * @returns {string}
 */
function getGenotypeAbbreviation( bunny, furAllelesVisible, earsAllelesVisible, teethAllelesVisible ) {

  assert && assert( bunny instanceof Bunny, 'invalid bunny' );
  assert && assert( typeof furAllelesVisible === 'boolean', 'invalid furAllelesVisible' );
  assert && assert( typeof earsAllelesVisible === 'boolean', 'invalid earsAllelesVisible' );
  assert && assert( typeof teethAllelesVisible === 'boolean', 'invalid teethAllelesVisible' );

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
export default PedigreeBunnyNode;