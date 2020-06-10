// Copyright 2020, University of Colorado Boulder

//TODO lots of duplication with BunnyNode
/**
 * PedigreeBunnyNode is the representation of a Bunny in the Pedigree graph. Origin at bottom center of bunny image.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
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
import BunnyImageCache from '../BunnyImageCache.js';
import MutationIconNode from '../MutationIconNode.js';
import OriginNode from '../OriginNode.js';

// constants
const IMAGE_SCALE = 0.4; // how much the bunny PNG image is scaled
const ALLELES_FONT = new PhetFont( 16 );
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
      isSelected: false
    }, options );

    const children = [];

    const wrappedImage = BunnyImageCache.getWrappedImage( bunny, {
      scale: IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );
    children.push( wrappedImage );

    const allelesNode = new Text( '', {
      font: ALLELES_FONT,
      maxWidth: wrappedImage.width
    } );
    children.push( allelesNode );

    if ( bunny.genotype.isOriginalMutant ) {
      children.push( new MutationIconNode( {
        radius: 12,
        left: wrappedImage.left,
        bottom: wrappedImage.bottom
      } ) );
    }

    // Rectangle that appears around the selected bunny. Similar to the rectangle in BunnyNode, but tweaked to look
    // better with the size and background color used for the Pedigree graph.
    if ( options.isSelected ) {
      const selectionRectangle = new Rectangle( wrappedImage.bounds.dilated( 3 ), {
        fill: 'rgba( 0, 0, 0, 0.1 )',
        stroke: NaturalSelectionColors.SELECTED_BUNNY_STROKE,
        lineWidth: 2,
        cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
        center: wrappedImage.center,
        pickable: false
      } );
      children.unshift( selectionRectangle );
    }

    if ( NaturalSelectionQueryParameters.showOrigin ) {
      children.push( new OriginNode( 4 ) );
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
          left: wrappedImage.left,
          bottom: wrappedImage.centerY
        } ) );
      }
    };
    bunny.diedEmitter.addListener( diedListener );
    diedListener( bunny.isAlive );

    Property.multilink(
      [ furAllelesVisibleProperty, earsAllelesVisibleProperty, teethAllelesVisibleProperty ],
      ( furAllelesVisible, earsAllelesVisible, teethAllelesVisible ) => {
        allelesNode.visible = ( furAllelesVisible || earsAllelesVisible || teethAllelesVisible );
        allelesNode.text = getAllelesString( bunny, furAllelesVisible, earsAllelesVisible, teethAllelesVisible );
        allelesNode.centerX = wrappedImage.centerX;
        allelesNode.top = wrappedImage.bottom + 5;
      } );

    // @private
    this.disposePedigreeBunnyNode = () => {
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
 * Gets the allele abbreviations that describe a Bunny's genotype, e.g. 'FfEEtt'.
 * @param {Bunny} bunny
 * @param {boolean} furAllelesVisible
 * @param {boolean} earsAllelesVisible
 * @param {boolean} teethAllelesVisible
 * @returns {string}
 */
function getAllelesString( bunny, furAllelesVisible, earsAllelesVisible, teethAllelesVisible ) {

  assert && assert( bunny instanceof Bunny, 'invalid bunny' );
  assert && assert( typeof furAllelesVisible === 'boolean', 'invalid furAllelesVisible' );
  assert && assert( typeof earsAllelesVisible === 'boolean', 'invalid earsAllelesVisible' );
  assert && assert( typeof teethAllelesVisible === 'boolean', 'invalid teethAllelesVisible' );

  let allelesString = '';

  if ( furAllelesVisible ) {
    allelesString += bunny.genotype.furGenePair.getAllelesAbbreviation();
  }

  if ( earsAllelesVisible ) {
    allelesString += bunny.genotype.earsGenePair.getAllelesAbbreviation();
  }

  if ( teethAllelesVisible ) {
    allelesString += bunny.genotype.teethGenePair.getAllelesAbbreviation();
  }

  return allelesString;
}

naturalSelection.register( 'PedigreeBunnyNode', PedigreeBunnyNode );
export default PedigreeBunnyNode;