// Copyright 2020, University of Colorado Boulder

/**
 * BunnyNode is the view of a Bunny, used in both the environment and Pedigree graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from '../model/Bunny.js';
import SelectedBunnyProperty from '../model/SelectedBunnyProperty.js';
import NaturalSelectionColors from '../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import BunnyImageCache from './BunnyImageCache.js';
import MutationIconNode from './MutationIconNode.js';

// constants
const IMAGE_SCALE = 0.4; // how much the bunny PNG image is scaled

class BunnyNode extends Node {

  /**
   * @param {Bunny} bunny
   * @param {SelectedBunnyProperty} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( bunny, selectedBunnyProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( selectedBunnyProperty instanceof SelectedBunnyProperty );

    options = merge( {}, options );

    const wrappedImage = BunnyImageCache.getWrappedImage( bunny, {
      scale: IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );

    // Rectangle that appears around this Node when bunny is selected
    const selectionRectangle = new Rectangle( wrappedImage.bounds.dilated( 3 ), {
      fill: 'rgba( 0, 0, 0, 0.25 )',
      stroke: NaturalSelectionColors.SELECTED_BUNNY_STROKE,
      lineWidth: 2,
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      center: wrappedImage.center,
      pickable: false
    } );

    assert && assert( !options.children, 'BunnyNode sets children' );
    options.children = [ selectionRectangle, wrappedImage ];

    // Label original mutant with an icon
    if ( bunny.genotype.isOriginalMutant ) {
      options.children.push( new MutationIconNode( {
        right: wrappedImage.centerX,
        bottom: wrappedImage.bottom,
        pickable: false
      } ) );
    }

    super( options );

    // Indicate that this bunny is selected.
    const selectedBunnyListener = someBunny => {
      selectionRectangle.visible = ( someBunny === bunny );
    };
    selectedBunnyProperty.link( selectedBunnyListener ); // unlink is required

    // @private
    this.disposeBunnyNode = () => {
      selectedBunnyProperty.unlink( selectedBunnyListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeBunnyNode();
    super.dispose();
  }
}

naturalSelection.register( 'BunnyNode', BunnyNode );
export default BunnyNode;