// Copyright 2020, University of Colorado Boulder

//TODO https://github.com/phetsims/natural-selection/issues/128 delete, replaced by Sprites
/**
 * EnvironmentBunnyNode is the view of a Bunny in the environment.  It moves the bunny around.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import naturalSelection from '../../../naturalSelection.js';
import Bunny from '../../model/Bunny.js';
import SelectedBunnyProperty from '../../model/SelectedBunnyProperty.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';
import BunnyNode from '../BunnyNode.js';
import OrganismNode from '../OrganismNode.js';
import OriginNode from '../OriginNode.js';

class EnvironmentBunnyNode extends OrganismNode {

  /**
   * @param {Bunny} bunny
   * @param {SelectedBunnyProperty} selectedBunnyProperty
   * @param {Object} [options]
   */
  constructor( bunny, selectedBunnyProperty, options ) {

    assert && assert( bunny instanceof Bunny, 'invalid bunny' );
    assert && assert( selectedBunnyProperty instanceof SelectedBunnyProperty );

    options = merge( {

      // Whether to show the mutation icon on original mutants
      showMutationIcon: NaturalSelectionQueryParameters.labelMutants,

      // Node options
      cursor: 'pointer'
    }, options );

    const bunnyNode = new BunnyNode( bunny, selectedBunnyProperty, {
      showMutationIcon: options.showMutationIcon
    } );

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