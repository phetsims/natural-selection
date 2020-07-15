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
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import MutationIconNode from '../MutationIconNode.js';
import OriginNode from '../OriginNode.js';
import BunnyImageCache from './BunnyImageCache.js';

// constants
const IMAGE_SCALE = 0.4; // how much the bunny PNG image is scaled
const GENOTYPE_FONT = new PhetFont( 16 );
const DEAD_SYMBOL_FONT = new PhetFont( 20 );

class PedigreeBunnyNode extends Node {

  /**
   * @param {Bunny} bunny
   * @param {Property.<boolean>} furAllelesVisibleProperty
   * @param {Property.<boolean>} earsAllelesVisibleProperty
   * @param {Property.<boolean>} teethAllelesVisibleProperty
   * @param {Object} [options]
   */
  constructor( bunny, furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && AssertUtils.assertPropertyOf( furAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( earsAllelesVisibleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( teethAllelesVisibleProperty, 'boolean' );

    options = merge( {
      showMutationIcon: true,
      bunnyIsSelected: false
    }, options );

    const children = [];

    const wrappedImage = BunnyImageCache.getWrappedImage( bunny, {
      scale: IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );
    children.push( wrappedImage );

    // Label original mutant with an icon
    if ( bunny.isOriginalMutant() ) {
      children.push( new MutationIconNode( {
        right: wrappedImage.centerX,
        bottom: wrappedImage.bottom,
        pickable: false
      } ) );
    }

    // Genotype abbreviation
    const genotypeNode = new Text( '', {
      font: GENOTYPE_FONT,
      maxWidth: wrappedImage.width
    } );
    children.push( genotypeNode );

    // Optional selection rectangle
    if ( options.bunnyIsSelected ) {
      const selectionRectangle = new Rectangle( wrappedImage.bounds.dilated( 3 ), {
        fill: 'rgba( 0, 0, 0, 0.25 )',
        stroke: NaturalSelectionColors.SELECTED_BUNNY_STROKE,
        lineWidth: 2,
        cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
        center: wrappedImage.center,
        pickable: false
      } );
      children.push( selectionRectangle );
      selectionRectangle.moveToBack();
    }

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
          right: wrappedImage.centerX,
          bottom: wrappedImage.centerY
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
        genotypeNode.centerX = wrappedImage.centerX;
        genotypeNode.top = wrappedImage.bottom + 5;
      } );

    // @private
    this.disposePedigreeBunnyNode = () => {
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