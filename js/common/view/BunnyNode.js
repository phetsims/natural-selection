// Copyright 2020, University of Colorado Boulder

/**
 * BunnyNode is the view of a Bunny.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import bunnyWhiteFurStraightEarsShortTeethImage from '../../../images/bunny-whiteFur-straightEars-shortTeeth_png.js';
import naturalSelection from '../../naturalSelection.js';
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

      // SpriteNode options
      scaleFactor: 0.4, // scale applied in addition to modelViewTransform scale

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true,
      phetioType: ReferenceIO //TODO why doesn't PhetioGroup( BunnyNodeIO ) work?
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
  }
}

export default naturalSelection.register( 'BunnyNode', BunnyNode );