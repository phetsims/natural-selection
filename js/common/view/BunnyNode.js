// Copyright 2020, University of Colorado Boulder

/**
 * BunnyNode is the view of a Bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import Bunny from '../model/Bunny.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import NaturalSelectionQueryParameters from '../NaturalSelectionQueryParameters.js';
import BunnyImageCache from './BunnyImageCache.js';
import BunnyNodeIO from './BunnyNodeIO.js';
import OriginNode from './OriginNode.js';
import SpriteNode from './SpriteNode.js';

// constants
const IMAGE_SCALE = 0.4; // how much the bunny PNG images are scaled

class BunnyNode extends SpriteNode {

  /**
   * @param {Bunny} bunny
   * @param {Property.<Bunny>} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( bunny, selectedBunnyProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( selectedBunnyProperty instanceof Property, 'invalid selectedBunnyProperty' );

    options = merge( {

      // Node options
      cursor: 'pointer',

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true,
      phetioType: BunnyNodeIO
    }, options );

    const image = BunnyImageCache.getWrappedImage( bunny, {
      scale: IMAGE_SCALE,
      centerX: 0,
      bottom: 0
    } );

    // Rectangle that appears around this Node when bunny is selected
    const selectionRectangle = new Rectangle( image.bounds.dilated( 5 ), {
      fill: 'rgba( 0, 0, 0, 0.25 )',
      stroke: 'blue',
      lineWidth: 2.5,
      cornerRadius: NaturalSelectionConstants.CORNER_RADIUS,
      center: image.center,
      pickable: false
    } );

    assert && assert( !options.children, 'BunnyNode sets children' );
    options.children = [ selectionRectangle, image ];

    // Red dot at the origin
    if ( NaturalSelectionQueryParameters.showOrigin ) {
      options.children.push( new OriginNode() );
    }

    super( bunny, options );

    // Indicate that this bunny is selected
    const selectedBunnyListener = someBunny => {
      selectionRectangle.visible = ( someBunny === bunny );
    };
    selectedBunnyProperty.link( selectedBunnyListener );

    // @private
    this.disposeBunnyNode = () => {
      selectedBunnyProperty.unlink( selectedBunnyListener );
    };

    // @private
    this.bunny = bunny;
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

export default naturalSelection.register( 'BunnyNode', BunnyNode );