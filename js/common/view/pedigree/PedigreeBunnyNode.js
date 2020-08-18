// Copyright 2020, University of Colorado Boulder

/**
 * PedigreeBunnyNode is the view of a bunny in the Pedigree graph. It ignores bunny motion, and displays
 * only the information that is relevant to pedigree.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import BunnySelectionRectangle from '../BunnySelectionRectangle.js';
import BunnySpritesMap from '../BunnySpritesMap.js';
import MutationIconNode from '../MutationIconNode.js';
import OriginNode from '../OriginNode.js';

// constants
const GENOTYPE_FONT = new PhetFont( 16 );
const DEAD_SYMBOL_FONT = new PhetFont( 20 );

class PedigreeBunnyNode extends Node {

  /**
   * @param {Bunny} bunny
   * @param {BunnySpritesMap} bunnySpritesMap
   * @param {Property.<boolean>} furAllelesVisibleProperty
   * @param {Property.<boolean>} earsAllelesVisibleProperty
   * @param {Property.<boolean>} teethAllelesVisibleProperty
   * @param {Object} [options]
   */
  constructor( bunny, bunnySpritesMap,
               furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( bunnySpritesMap instanceof BunnySpritesMap, 'invalid bunnySpritesMap' );
    assert && AssertUtils.assertPropertyOf( furAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( earsAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( teethAllelesVisibleProperty, 'boolean' );

    options = merge( {
      showMutationIcon: true,
      bunnyIsSelected: false
    }, options );

    const children = [];

    // Node that corresponds to the bunny's phenotype (appearance)
    const wrappedNode = bunnySpritesMap.getWrappedNode( bunny, {
      scale: NaturalSelectionConstants.BUNNY_IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );
    children.push( wrappedNode );

    // Label original mutant with an icon
    if ( bunny.isOriginalMutant() ) {
      children.push( new MutationIconNode( {
        right: wrappedNode.centerX,
        bottom: wrappedNode.bottom,
        pickable: false
      } ) );
    }

    // Genotype abbreviation
    const genotypeNode = new Text( '', {
      font: GENOTYPE_FONT,
      maxWidth: wrappedNode.width
    } );
    children.push( genotypeNode );

    // Optional selection rectangle, prepended to children
    if ( options.bunnyIsSelected ) {
      children.unshift( new BunnySelectionRectangle( wrappedNode.bounds.dilated( 3 ), {
        center: wrappedNode.center
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
      this.addChild( new Text( '\u274c', {
        font: DEAD_SYMBOL_FONT,
        right: wrappedNode.centerX,
        bottom: wrappedNode.centerY
      } ) );
    };
    if ( bunny.isAlive ) {

      // removeListener in dispose. Not necessary to removeListener when diedEmitter fires, because it disposes itself.
      bunny.diedEmitter.addListener( addRedCrossMark );
    }
    else {
      addRedCrossMark();
    }

    // Update the genotype abbreviation, must be disposed
    const multilink = new Multilink(
      [ furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty ],
      ( furAllelesVisible, earsAllelesVisible, teethAllelesVisible ) => {
        genotypeNode.visible = ( furAllelesVisible || earsAllelesVisible || teethAllelesVisible );
        genotypeNode.text = getGenotypeAbbreviation( bunny, furAllelesVisible, earsAllelesVisible, teethAllelesVisible );
        genotypeNode.centerX = wrappedNode.centerX;
        genotypeNode.top = wrappedNode.bottom + 5;
      } );

    // @private
    this.disposePedigreeBunnyNode = () => {
      multilink.dispose();
      if ( bunny.diedEmitter.hasListener( addRedCrossMark ) ) {
        bunny.diedEmitter.removeListener( addRedCrossMark );
      }
    };

    // If logging is enabled, pressing on a bunny logs its details to the console.
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