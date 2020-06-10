// Copyright 2020, University of Colorado Boulder

/**
 * EnvironmentBunnyNode is the view of a Bunny in the environment.  It moves the bunny around.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import BunnyNode from '../BunnyNode.js';
import NaturalSelectionSpriteNode from '../NaturalSelectionSpriteNode.js';
import OriginNode from '../OriginNode.js';
import EnvironmentBunnyNodeIO from './EnvironmentBunnyNodeIO.js';

class EnvironmentBunnyNode extends NaturalSelectionSpriteNode {

  /**
   * @param {Bunny} bunny
   * @param {SelectedBunnyProperty} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( bunny, selectedBunnyProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( selectedBunnyProperty instanceof SelectedBunnyProperty );

    options = merge( {

      // Node options
      cursor: 'pointer',

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true,
      phetioType: EnvironmentBunnyNodeIO
    }, options );

    const bunnyNode = new BunnyNode( bunny, selectedBunnyProperty );

    assert && assert( !options.children, 'BunnyNode sets children' );
    options.children = [ bunnyNode ];

    // Red dot at the origin
    if ( NaturalSelectionQueryParameters.showOrigin ) {
      options.children.push( new OriginNode() );
    }

    super( bunny, options );

    // @public (read-only)
    this.bunny = bunny;

    // @private
    this.disposeEnvironmentBunnyNode = () => {
      bunnyNode.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeEnvironmentBunnyNode();
    super.dispose();
  }
}

naturalSelection.register( 'EnvironmentBunnyNode', EnvironmentBunnyNode );
export default EnvironmentBunnyNode;