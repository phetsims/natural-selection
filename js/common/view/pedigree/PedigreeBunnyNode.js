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
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import BunnyNode from '../BunnyNode.js';
import OriginNode from '../OriginNode.js';

// constants
const GENOTYPE_FONT = new PhetFont( 16 );
const DEAD_SYMBOL_FONT = new PhetFont( 20 );

class PedigreeBunnyNode extends Node {

  /**
   * @param {Bunny} bunny
   * @param {SelectedBunnyProperty} selectedBunnyProperty
   * @param {Property.<boolean>} furAllelesVisibleProperty
   * @param {Property.<boolean>} earsAllelesVisibleProperty
   * @param {Property.<boolean>} teethAllelesVisibleProperty
   * @param {Object} [options]
   */
  constructor( bunny, selectedBunnyProperty, furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( selectedBunnyProperty instanceof SelectedBunnyProperty, 'invalid selectedBunnyProperty' );
    assert && AssertUtils.assertPropertyOf( furAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( earsAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( teethAllelesVisibleProperty, 'boolean' );

    options = merge( {}, options );

    const children = [];

    const bunnyNode = new BunnyNode( bunny, selectedBunnyProperty );
    children.push( bunnyNode );

    // Genotype abbreviation
    const genotypeNode = new Text( '', {
      font: GENOTYPE_FONT,
      maxWidth: bunnyNode.width
    } );
    children.push( genotypeNode );

    if ( NaturalSelectionQueryParameters.showOrigin ) {
      children.push( new OriginNode() );
    }

    assert && assert( !options.children, 'PedigreeBunnyNode sets children' );
    options.children = children;

    super( options );

    const diedListener = isAlive => {
      if ( !isAlive ) {
        bunny.diedEmitter.removeListener( diedListener );

        // Unicode red cross mark
        this.addChild( new Text( '\u274c', {
          font: DEAD_SYMBOL_FONT,
          right: bunnyNode.centerX,
          bottom: bunnyNode.centerY
        } ) );
      }
    };
    bunny.diedEmitter.addListener( diedListener ); // removeListener is handled by diedListener
    diedListener( bunny.isAlive );
    
    // Update the genotype abbreviation, must be disposed
    const multilink = new Multilink(
      [ furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty ],
      ( furAllelesVisible, earsAllelesVisible, teethAllelesVisible ) => {
        genotypeNode.visible = ( furAllelesVisible || earsAllelesVisible || teethAllelesVisible );
        genotypeNode.text = getGenotypeAbbreviation( bunny, furAllelesVisible, earsAllelesVisible, teethAllelesVisible );
        genotypeNode.centerX = bunnyNode.centerX;
        genotypeNode.top = bunnyNode.bottom + 5;
      } );

    // @private
    this.disposePedigreeBunnyNode = () => {
      bunnyNode.dispose();
      multilink.dispose();
      if ( bunny.diedEmitter.hasListener( diedListener ) ) {
        bunny.diedEmitter.removeListener( diedListener );
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