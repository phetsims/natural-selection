// Copyright 2020, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */


import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
// images
import bunnyWhiteFurStraightEarsShortTeethImage from '../../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';
// modules
import Bunny from '../model/Bunny.js';
import SpriteNode from './SpriteNode.js';

class BunnyNode extends SpriteNode {

  /**
   * @param {Bunny} bunny
   * @param {Object} [options]
   */
  constructor( bunny, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );

    options = merge( {
      showDeadBunny: false,

      // SpriteNode options
      scaleFactor: 0.4 // scale applied in addition to modelViewTransform scale
    }, options );

    const image = new Image( bunnyWhiteFurStraightEarsShortTeethImage, {
      centerX: 0,
      bottom: 0
    } );

    assert && assert( !options.children, 'BunnyNode sets children' );
    options.children = [ image ];

    if ( phet.chipper.queryParameters.dev ) {

      // Red dot at the origin
      options.children.push( new Circle( 4, { fill: 'red' } ) );
    }

    super( bunny, options );

    // Optionally hide the bunny when it dies. Dead bunnies are shown in the Pedigree graph.
    const bunnyIsAliveObserver = isAlive => {
      this.visible = isAlive || options.showDeadBunny;
    };
    bunny.isAliveProperty.link( bunnyIsAliveObserver );

    // Dispose this node when its associated bunny is disposed.
    const bunnyDisposedListener = () => {
      this.dispose();
    };
    bunny.disposedEmitter.addListener( bunnyDisposedListener );

    // @private
    this.disposeBunnyNode = () => {
      bunny.isAliveProperty.unlink( bunnyIsAliveObserver );
      bunny.disposedEmitter.removeListener( bunnyDisposedListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    super.dispose();
    this.disposeBunnyNode();
  }
}

export default naturalSelection.register( 'BunnyNode', BunnyNode );