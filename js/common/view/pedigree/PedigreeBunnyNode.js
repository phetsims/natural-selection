// Copyright 2020, University of Colorado Boulder

/**
 * PedigreeBunnyNode is the representation of a Bunny in the Pedigree graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import merge from '../../../../../phet-core/js/merge.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import BunnyImageCache from '../BunnyImageCache.js';
import MutationIconNode from '../MutationIconNode.js';

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
    assert && assert( furAllelesVisibleProperty instanceof Property, 'invalid furAllelesVisibleProperty' );
    assert && assert( earsAllelesVisibleProperty instanceof Property, 'invalid earsAllelesVisibleProperty' );
    assert && assert( teethAllelesVisibleProperty instanceof Property, 'invalid teethAllelesVisibleProperty' );

    options = merge( {
      isSelected: false
    }, options );

    const children = [];

    const wrappedImage = BunnyImageCache.getWrappedImage( bunny );
    children.push( wrappedImage );

    const allelesNode = new Text( '', {
      font: new PhetFont( 40 ),
      maxWidth: wrappedImage.width
    } );
    children.push( allelesNode );

    if ( bunny.genotype.isFirstGenerationMutant ) {
      children.push( new MutationIconNode( {
        radius: 30,
        left: wrappedImage.left,
        bottom: wrappedImage.bottom
      } ) );
    }

    // Rectangle that appears around the selected bunny
    if ( options.isSelected ) {

      //TODO copied from BunnyNode, factor out into BunnySelectionRectangle
      //TODO stroke doesn't appear to be the same lineWidth as selected bunny in environment because its scaled here
      const selectionRectangle = new Rectangle( wrappedImage.bounds.dilated( 5 ), {
        fill: 'rgba( 0, 0, 0, 0.25 )',
        stroke: 'blue',
        lineWidth: 2.5,
        cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
        center: wrappedImage.center,
        pickable: false
      } );
      children.unshift( selectionRectangle );
    }

    assert && assert( !options.children, 'PedigreeBunnyNode sets children' );
    options.children = children;

    super( options );

    //TODO add OriginNode

    const isAliveListener = isAlive => {
      if ( !isAlive ) {
        bunny.isAliveProperty.unlink( isAliveListener );
        this.addChild( new Text( '\u274c', {
          font: new PhetFont( 60 ),
          left: wrappedImage.left,
          top: wrappedImage.top
        } ) );
      }
    };
    bunny.isAliveProperty.link( isAliveListener );

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
      if ( bunny.isAliveProperty.hasListener( isAliveListener ) ) {
        bunny.isAliveProperty.unlink( isAliveListener );
      }
    };

    // If logging is enabled, pressing on a bunny logs its details to the console.
    if ( phet.log ) {
      this.addInputListener( {
        down: () => phet.log( bunny.toString() )
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